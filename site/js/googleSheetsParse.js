var v = document.getElementById("tableId");
var p = document.getElementById("pageId");
var inputs = document.getElementById("leftWindow");
var sendBut = document.getElementById("SendButton");
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var down = document.getElementById("downTriangle");
var up = document.getElementById("upTriangle");
var hidden = document.getElementById("hidden");
var map = document.getElementById("map");
var t =  document.createElement("table");

var marker = [];
var infowindow = {};
var contentString = {};
var places;
var map;
var columns = {};
var names = [];
var counter = 0;


down.onclick = openExtraField;
up.onclick = closeExtraField;

function openExtraField(event) {
    up.style.display = 'block';
    down.style.display = 'none';
    hidden.style.display = 'block';	
}

function closeExtraField(event) {
    down.style.display = 'block';
    up.style.display = 'none';
    hidden.style.display = 'none';
}


var CLIENT_ID = '858139403726-0ru9uicbkoo5o3i98idspa9onocbhi5n.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBqxSOO8-ABdeDtEapbKXWC_7j7g57HC18';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

/* On load, called to load the auth2 library and API client library. */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/* Initializes the API client library and sets up sign-in state listeners.*/
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        sendBut.onclick = handleInputClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        inputs.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        inputs.style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function handleInputClick(event) {
	counter += 1;
	var address = v.value;
	var pAddress = p.value;
	if (counter > 1) {
		clearAll();
	}
	listPlaces(address, pAddress);
}
/* Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function clearAll(event) {
    removeMarkers();
	t.removeChild();
}






function listPlaces(address, pAddress) {
    address.replace('//', '/');
    var ref = address.split('/');
    for (var j = 0; j < 6; j++) {
        if (ref[j] == 'd')
            var num = j + 1;
    }
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: ref[num], //'1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: pAddress, //'Map!A1:G',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            var mainStr = range.values[0];         
	names[0] = 'genbank';
	columns[names[0]] = parser(mainStr, 'genbank', 'Genbank');
        names[1] = 'name';
	columns[names[1]] = parser(mainStr, 'name', 'Name');
        names[2] = 'lat';
	columns[names[2]] = parser(mainStr, 'latitude', 'Latitude');
	names[3] = 'lng';
	columns[names[3]] = parser(mainStr, 'longitude', 'Longitude');
	names[4] = 'pos';
	columns[names[4]] = parser(mainStr, 'pos', 'Pos');
	names[5] = 'date';
	columns[names[5]] = parser(mainStr, 'date', 'Date');
	names[6] = 'int';
	columns[names[6]] = parser(mainStr, 'int', 'Int');
	names[7] = 'float';
	columns[names[7]] = parser(mainStr, 'float', 'Float');
		
	//var t = document.getElementById("table");
       	for (var j = 0; j < names.length; j++)
	{
		if (columns[names[j]] != -1)
		{	
			var tr = document.createElement("tr");
			var th = document.createElement("th");
			th.innerHTML = names[j];
			tr.append(th);
			var td1 = document.createElement("td");
			var td2 = document.createElement("td");
			var from = document.createElement('input');
			var to = document.createElement('input');
			from.placeholder = "from:";
			from.className="from";
			to.placeholder = "to:";
			to.className="to";
			from.type = "text";
			to.type = "text";
			td1.append(from);
			td2.append(to);
			tr.append(td1);
			tr.append(td2);
			t.append(tr);
		}
	}
	document.getElementById('table').appendChild(t);
	
            for (var i = 1; i < range.values.length; i++) {
                var row = range.values[i];
                //appendPre(row[gen_id] + ', ' + row[name_id]);
                marker[i - 1] = new google.maps.Marker({
                    position: {
                        lat: Number.parseInt(row[columns['lat']]),
                        lng: Number.parseInt(row[columns['lng']])
                    },
                    map: map,
                    title: 'Location №' + i
                });
                contentString[i] = 'genbank: ' + row[columns['genbank']] + '<br>' + 'Position: ' + row[columns['pos']];
                infowindow[i] = new google.maps.InfoWindow({
                    content: contentString[i]
                });
                marker[i - 1].infowindow = infowindow[i];
                marker[i - 1].addListener('click', function() {
                    return this.infowindow.open(map, this);
                });

            }
        } else {
            appendPre('No data found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function parseMarkers() {
	                
}

function removeMarkers() {
    if (marker) {
        for (i = 0; i < marker.length; i++) {
            marker[i].setMap(null);
        }
        marker = [];
    }
}

function parser(str, name1, name2) {
    for (var i = 0; i < str.length; i++) {
        if ((str[i].search(name1) != -1) or (str[i].search(name2) != -1))
            return i;
    }
    return -1;
}

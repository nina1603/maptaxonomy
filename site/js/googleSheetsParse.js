var v = document.getElementById("tableId");
var p = document.getElementById("pageId");
var inputs = document.getElementById("leftWindow");
var sendBut = document.getElementById("SendButton");
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var apply = document.getElementById('ApplyButton');
var down = document.getElementById("downTriangle");
var up = document.getElementById("upTriangle");
var hidden = document.getElementById("hidden");
var map = document.getElementById("map");
var t =  document.createElement("table");


var places;
var map;
var range;
var bool = 1;
var counter = 0; 
var latCounter = 0;
var lngCounter = 0;
var latCoords = -1;
var lngCoords = -1;
var nameCoords = -1;
var dateCoords = -1;

var marker = [];
var infowindow = {};
var contentString = {};
var names = [];
var froms = [];
var tos = [];
var types = [['genbank', 'gen', 'Genbank'], 
	     ['name', 'Name'], 
	     ['position', 'Pos', 'loc', 'Location'],
	     ['lat', 'Lat'],
	     ['lng', 'Lng', 'longitude', 'Longitude'],
	     ['date', 'Date'],
	     ['int', 'Int', 'Num', 'num'],
	     ['float', 'Float', 'double', 'Double']];

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
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
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
 * @param {string} message Text to be placed in pre element.
 */

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function clearAll(event) {
    removeMarkers();
	t.innerHTML = [];
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
        range = response.result;
        if (range.values.length > 0) {
            var mainStr = range.values[0];
	for (var j = 0; j < mainStr.length; j++)
	{
		names[j] = getDatatype(mainStr[j]);
		if (names[j] == 'lat') {
			latCoords = j;
			latCounter += 1;
		}
		if (names[j] == 'lng') {
			lngCoords = j;
			lngCounter += 1;
		}
		if (names[j] == 'date') dateCoords = j;
		if (names[j] == 'name') nameCoords = j;
	}
	if ((latCoords == -1) || (lngCoords == -1))
		alert("Coordinates haven't been given! Cannot print markers");
	if ((latCounter > 1) || (lngCounter > 1))
		alert("More than one coordinate has been given! Only the last one will be used!");
       	for (var j = 0; j < names.length; j++)
	{	
			var tr = document.createElement("tr");
			var th = document.createElement("th");
			th.innerHTML = mainStr[j];
			tr.append(th);
			var td1 = document.createElement("td");
			var td2 = document.createElement("td");
			//var from = document.createElement('input');
			froms[j] = document.createElement('input');
			var from = froms[j];
			//var to = document.createElement('input');
			tos[j] = document.createElement('input');
			if ((names[j] == 'genbank') || (names[j] == 'name') || (names[j] == 'position'))
			    tos[j].value = 0;
			var to = tos[j];
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
	document.getElementById('table').appendChild(t);
	//apply.onClick = parseMarkers(range);
		
		
            for (var i = 1; i < range.values.length; i++) {
                var row = range.values[i];
                //appendPre(row[gen_id] + ', ' + row[name_id]);
                marker[i - 1] = new google.maps.Marker({
                    position: {
                        lat: Number.parseInt(row[latCoords]),
                        lng: Number.parseInt(row[lngCoords])
                    },
                    map: map,
                    title: 'Location №' + i
                });
                contentString[i] = 'name:' + row[nameCoords] + '<br>' + 'date:' + row[dateCoords];
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
	removeMarkers();
	for (var j = 0; j < names.length; j++)
	{
		console.log(froms[j].value, tos[j].value);
	}
	
	 for (var i = 1; i < range.values.length; i++) {
                var row = range.values[i];
 		for (var j = 0; j < names.length; j++)
		{
			if ((names[j] == 'genbank') || (names[j] == 'name') || (names[j] == 'position')) {
				if (froms[j] !== row[j])
					bool = 0;
			}
			else {
			}
		}
                if (bool == 1)
		{
			marker[i - 1] = new google.maps.Marker({
                    	position: {
                    	    lat: Number.parseInt(row[latCoords]),
                    	    lng: Number.parseInt(row[lngCoords])
                    	},
                    	map: map,
                    	title: 'Location №' + i
                	});
                	contentString[i] = 'name:' + row[nameCoords] + '<br>' + 'date:' + row[dateCoords];
                	infowindow[i] = new google.maps.InfoWindow({
                	    content: contentString[i]
                	});
                	marker[i - 1].infowindow = infowindow[i];
                	marker[i - 1].addListener('click', function() {
                	    return this.infowindow.open(map, this);
                	});
		}
	 }
}


function removeMarkers() {
    if (marker) {
        for (i = 0; i < marker.length; i++) {
            marker[i].setMap(null);
        }
        marker = [];
    }
}

/*function parser(str, name1, name2) {
    for (var i = 0; i < str.length; i++) {
        if ((str[i].search(name1) != -1) || (str[i].search(name2) != -1))
            return i;
    }
    return -1;
}*/

function getDatatype(str) {
	var counter = 0;
	for (var k = 0; k < types.length; k++) {
		for (var h = 0; h < types[k].length; h++) {
			if (str.search(types[k][h]) != -1) {
				counter += 1;
			}
		}
		if (counter > 0) return types[k][0];
	}
	return -1;
}

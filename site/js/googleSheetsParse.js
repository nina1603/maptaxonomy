var v = document.getElementById("tableId");
var p = document.getElementById("pageId");
var inputs = document.getElementById("leftWindow");
var sendBut = document.getElementById("SendButton");
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var map;
	function initMap() {
        	var location = {lat: 55.700, lng: 37.600};
        	var uluru = {lat: -25.363, lng: 131.044};
        	map = new google.maps.Map(document.getElementById('map'), {
        	  zoom: 4,
       		  center: location
        	});
		authorizeButton.addListener('click', function(e) {
       			removeMarkers();
   		});
	}

var marker = [];
var infowindow = {};
var contentString = {};
var places;

var CLIENT_ID = '858139403726-0ru9uicbkoo5o3i98idspa9onocbhi5n.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBqxSOO8-ABdeDtEapbKXWC_7j7g57HC18';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";


/* On load, called to load the auth2 library and API client library.
 */
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
    var address = v.value;
    var pAddress = p.value;
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

/* Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listPlaces(address, pAddress) {
    address.replace('//', '/');
    var ref = address.split('/');
    for (var j = 0; j < 6; j++) {
        if (ref[j] == 'd')
            var num = j + 1;
    }
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: ref[num], //'1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: pAddress,//'Map!A1:G',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            var mainStr = range.values[0];
            var gen_id = parser(mainStr, 'genbank_id');
            var name_id = parser(mainStr, 'name');
            var lat = parser(mainStr, 'latitude');
            var lng = parser(mainStr, 'longitude');
            var pos_id = parser(mainStr, 'position');
            
            for (var i = 1; i < range.values.length; i++) {
                var row = range.values[i];
                //appendPre(row[gen_id] + ', ' + row[name_id]);
                marker[i - 1] = new google.maps.Marker({
                    position: {
                        lat: Number.parseInt(row[lat]),
                        lng: Number.parseInt(row[lng])
                    },
                    map: map,
                    title: 'Location №' + i
                });
                contentString[i] = 'genbank: ' + row[gen_id] + '<br>' + 'Position: ' + row[pos_id];
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

/*google.maps.event.addDomListener(map, 'click', function() {
    removeMarkers();
  });
*/

function removeMarkers() 
{
if (marker) {
  for (i = 0; i < marker.length; i++) {
    marker[i].setMap(null);
 }
  marker = [];
}
}
    
function parser(str, name) {
    for (var i = 0; i < str.length; i++) {
        if (str[i] == name)
            return i;
    }
    return -1;
}

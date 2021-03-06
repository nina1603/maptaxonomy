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
var t = document.createElement("table");


var places;
var map;
var range;
var counter = 0;
var count = 0;
var latCounter = 0;
var lngCounter = 0;
var latCoords = -1;
var lngCoords = -1;
var nameCoords = -1;
var dateCoords = -1;

var marker = [];
var coordsCounter = {};
var coordsLength = 0;
var coordinates = [];

var infowindow = {};
var title = [];
var contentString = {};
var names = [];
var froms = [];
var tos = [];
var types = [
    ['genbank', 'gen', 'Genbank'],
    ['name', 'Name'],
    ['position', 'Pos', 'loc', 'Location'],
    ['lat', 'Lat'],
    ['lng', 'Lng', 'longitude', 'Longitude'],
    ['date', 'Date'],
    ['int', 'Int', 'Num', 'num'],
    ['float', 'Float', 'double', 'Double'],
    ['str']
];

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
    sendBut.disabled = true;
    count += 1;
    var address = v.value;
    var pAddress = p.value;
    if (count > 1) {
        clearAll();
    }
    listPlaces(address, pAddress);
    sendBut.disabled = false;
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
            for (var j = 0; j < mainStr.length; j++) {
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
            for (var j = 0; j < names.length; j++) {
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                th.innerHTML = mainStr[j];
                tr.append(th);
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                froms[j] = document.createElement('input');
                var from = froms[j];
                tos[j] = document.createElement('input');
                var to = tos[j];
                from.placeholder = "from:";
                to.placeholder = "to:";
                if (names[j] == 'date') {
                    to.className = "date from";
                    from.className = "date to";
                }
                else {
                    from.className = "from";
                    to.className = "to";
                }
                from.type = "text";
                to.type = "text";
                if ((names[j] == 'genbank') || (names[j] == 'name') || (names[j] == 'position') || (names[j] == 'str')) {
                    tos[j].style.display = 'none';
                    froms[j].placeholder = "...";
                }
                
                td1.append(from);
                td2.append(to);
                tr.append(td1);
                tr.append(td2);
                t.append(tr);
            }
            document.getElementById('table').appendChild(t);

            $(".date").datepicker({
                yearRange: "c-10:c+10",
                changeMonth: true,
                changeYear: true,
                dateFormat: "yy-mm-dd"
            });
            
            for (var i = 1; i < range.values.length; i++) {
                var row = range.values[i];
                var latLoc = Number.parseFloat(row[latCoords]);
                var lngLoc = Number.parseFloat(row[lngCoords]);
                if (coordsCounter[latLoc + ',' + lngLoc] == undefined)
                    coordsCounter[latLoc + ',' + lngLoc] = [];
                coordsCounter[latLoc + ',' + lngLoc].push(row);
            }

            var i = 0;
            for (key in coordsCounter) {
                contentString[i] = '';
                title[i] = '';
                if (coordsCounter[key].length == 1)
                {
                    contentString[i] += coordsCounter[key][0];
                    title[i] += 'Name:' + coordsCounter[key][0][nameCoords];
                }
                else
                {
                    for (var n = 0; n < coordsCounter[key].length; n++) {
                    contentString[i] += (n + 1).toString() + '. ' + coordsCounter[key][n];
                    title[i] += (n + 1).toString() + '. Name:' + coordsCounter[key][n][nameCoords];
                    if (n < coordsCounter[key].length - 1) {
                        contentString[i] += '<br/>';
                        title[i] += '\n';
                        }
                    }
                }
                if (title[i].split('\n').length > 15) {
                    var ar = title[i].split('\n');
                    title[i] = '';
                    for (var f = 0; f < 15; f++) {
                        title[i] += ar[f] + '\n';
                    }
                    title[i] += '...'; 
                }
                marker[i] = new google.maps.Marker({
                    position: {
                        lat: Number.parseFloat(coordsCounter[key][0][latCoords]),
                        lng: Number.parseFloat(coordsCounter[key][0][lngCoords])
                    },
                    label: coordsCounter[key].length.toString(),
                    map: map,
                    title: title[i]
                });
                infowindow[i] = new google.maps.InfoWindow({
                    content: contentString[i]
                });
                infowindow[i].className = "infowindow";

                marker[i].infowindow = infowindow[i];
                marker[i].addListener('click', function() {
                    return this.infowindow.open(map, this);
                });
                i++;
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
    var bool = [];
    var conter = 0;
    for (key in coordsCounter) {
        for (var k = 0; k < coordsCounter[key].length; k++) {
            bool[k] = 1;
        }
        for (var j = 0; j < names.length; j++) {
            if ((names[j] == 'genbank') || (names[j] == 'name') || (names[j] == 'position') || (names[j] == 'str')) {
                if (froms[j].value != '') {
                    var str = froms[j].value;
                    for (var k = 0; k < coordsCounter[key].length; k++) {
                        if (bool[k] == 1) {
                            if (str != coordsCounter[key][k][j]) {
                                bool[k] = 0;
                            }
                        }
                    }
                }
            } else {
                if ((names[j] != 'date') && ((froms[j].value != '') || (tos[j].value != ''))) {
                    if (froms[j].value != '') {
                        var number = Number.parseFloat(froms[j].value);
                        for (var k = 0; k < coordsCounter[key].length; k++) {
                            if (bool[k] == 1) {
                                if (number > Number.parseFloat(coordsCounter[key][k][j]))
                                    bool[k] = 0;
                            }
                        }
                    }
                    if (tos[j].value != '') {
                        var number = Number.parseFloat(tos[j].value);
                        for (var k = 0; k < coordsCounter[key].length; k++) {
                            if (bool[k] == 1) {
                                if (number < Number.parseFloat(coordsCounter[key][k][j]))
                                    bool[k] = 0;
                            }
                        }
                    }
                }

                if ((names[j] == 'date') && ((froms[j].value != '') || (tos[j].value != ''))) {
                    if (froms[j].value != '') {
                        var date = Date.parse(froms[j].value);
                        for (var k = 0; k < coordsCounter[key].length; k++) {
                            if (bool[k] == 1) {
                                if (date > Date.parse(coordsCounter[key][k][j]))
                                    bool[k] = 0;
                            }
                        }
                    }
                    if (tos[j].value != '') {
                        var date = Date.parse(tos[j].value);
                        if (bool[k] == 1) {
                            if (date < Date.parse(coordsCounter[key][k][j]))
                                bool[k] = 0;
                        }
                    }
                }
            }
        }
        var c = 0;
        var sum = 0;
        contentString[conter] = '';
        title[conter] = '';
        for (var k = 0; k < coordsCounter[key].length; k++) {
            sum += bool[k];
            if (bool[k] == 1) {
                if (contentString[conter] != [])
                    contentString[conter] += (c + 1).toString() + '. ' + coordsCounter[key][k] + '<br/>';
                else
                    contentString[conter] = (c + 1).toString() + '. ' + coordsCounter[key][k] + '<br/>';
                if (title[conter] != [])
                    title[conter] += (c + 1).toString() + '. Name:' + coordsCounter[key][k][nameCoords] + '\n';
                else
                    title[conter] = (c + 1).toString() + '. Name:' + coordsCounter[key][k][nameCoords] + '\n';
                c++;
            }
        }
        console.log(title[conter]);
        if (title[conter].split('\n').length > 15) {
            var ar = title[conter].split('\n');
            title[conter] = '';
            for (var f = 0; f < 15; f++) {
                title[conter] += ar[f] + '\n';
            }
            title[conter] += '...';
        }
        if (sum > 0) {
            marker[conter] = new google.maps.Marker({
                position: {
                    lat: Number.parseFloat(coordsCounter[key][0][latCoords]),
                    lng: Number.parseFloat(coordsCounter[key][0][lngCoords])
                },
                label: c.toString(),
                map: map,
                title: title[conter]
            });
            infowindow[conter] = new google.maps.InfoWindow({
                content: contentString[conter]
            });
            marker[conter].infowindow = infowindow[conter];
            marker[conter].addListener('click', function() {
                return this.infowindow.open(map, this);
            });
            conter++;
        }
    }
}


function removeMarkers() {
    if (marker.length > 0) {
        for (i = 0; i < marker.length; i++) {
            marker[i].setMap(null);
        }
        marker = [];
    }
}


function clearAll(event) {
    removeMarkers();
    t.innerHTML = [];
    coordsCounter = {};
    latCounter = 0;
    lngCounter = 0;
}

function removeAll() {
    clearAll();
    v.value = '';
    p.value = '';
    closeExtraField();
}

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
    return types[types.length - 1][0];
}

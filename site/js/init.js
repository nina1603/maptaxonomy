var map;
function initMap() {
    var location = {
        lat: 55.700,
        lng: 37.600
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: location
    });
    //map.addListener('', function(e) {
    //	removeMarkers();
    //});
}
        /*var uluru = {
        lat: -25.363,
        lng: 131.044
    };
    var marker = new google.maps.Marker({
          position: uluru,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          title: 'Marker'
        });*/
        /*var marker2 = new google.maps.Marker({ 
          position: location,
          map: map,
          draggable: true,
          title: 'Second Marker' 
        });
        var contentString = 'Hello! I am the Marker. Move me :)';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
       });
	marker2.addListener('click', function() {
          infowindow.open(map, marker2);
       });      
	google.maps.event.addListener(marker, 'position_changed', update);
  	google.maps.event.addListener(marker2, 'position_changed', update);      
	      
        var flightPlanCoordinates = [
       marker.getPosition(), 
       marker2.getPosition()
        ];
        var flightPath = new google.maps.Polyline( {
        path: flightPlanCoordinates, 
        geodesic: true,
	draggable: true,
        strokeColor: '#FF0000',
      	strokeOpacity: 1.0,
      	strokeWeight: 2
    } );

  	flightPath.setMap(map);
	update();
function update() {
  var path = [marker.getPosition(), marker2.getPosition()];
  flightPath.setPath(path);
}
      }*/

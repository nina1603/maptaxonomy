a = document.createElement("div");
a.innerHTML = "Wait, it's loading...";
a.style.position = "absolute";
a.style.top = "50%";
a.style.left = "50%";
a.style.zIndex = 15;
a.style.display = "none";
    
function loadTable()
      {
        var xhr = new XMLHttpRequest();
	var places;
        xhr.open('GET', 'https://maptaxonomy.ru/api/v1/experiments/?format=json', true); ///maptaxonomy/sample_data/Table1.csv.json
        xhr.send();
        xhr.onreadystatechange = function()
        {
          if ((xhr.readyState > 0) && (xhr.readyState < 4))
              a.style.display = "block";
			if (xhr.readyState == 4)
			{
				a.style.display = "none";
          if (xhr.status != 200) 
          {
            // обработать ошибку
            alert( xhr.status + ': ' + xhr.statusText );
          }
          else
          {
            try
            {
              var data = JSON.parse(xhr.responseText);
              places = data.results;
		
            }
            catch (e)
            {
              alert( "Некорректный ответ: " + e.message);
		console.log(xhr.responseText);            
	    }
	  }
            showTable(places);
		}
          }
      }	
	 
	 var columnHandlers = {
				'genbank': function(x) {return 'Genbank: ' + 
	'<a  target=”_blank” href ="https://www.ncbi.nlm.nih.gov/gquery/?term=' + x + '">ссылка</a>'; },
				'latitude' : function(x) {return x},
				'longitude' : function(y) {return y},
				'position': function(x, y) {return 'Position: ' + x + '.'}
			}
	 
      function showTable(places) 
    {
		var headers = {};
	    	var loc = [];
		for (place in places)
		{
			for (i in places[place])
			{
				headers[i] = 1;
			}
		}
    		t = document.createElement("table");
		tr = document.createElement("tr");
		for (header in headers)
		{
			th = document.createElement("th");
			th.innerHTML = header;
			tr.append(th);
		}
		t.append(tr);
		for (place in places)
		{
			loc[place] = {};
			tr = document.createElement("tr");
			for (header in headers)
				{
					td = document.createElement("td");
					if (places[place].hasOwnProperty(header))
						{
							td.innerHTML = places[place][header];
							
							}
					tr.append(td);	
				}
			t.append(tr);
		document.body.append(t);
		
		//for (index in columnHandlers)
		//	console.log(index + '= ' + columnHandlers[index]);
		}
	    //var loc = {lat: columnHandlers['latitude'], lng: columnHandlers['longitude']};
	    var contentString = {}, info = {}, marker = {};
	for (place in places)
	{
		marker[place] = new google.maps.Marker({
		    position: {lat:columnHandlers['latitude'](places[place]['latitude']), 
			       lng: columnHandlers['longitude'](places[place]['longitude'])},
		    map: map,
		    title: 'Location №' + place
	    });
		contentString[place] = columnHandlers['genbank'](places[place]['genbank_id']) +  '<br>' +
			columnHandlers['position'](places[place]['position'], marker[place]);
	    	var infowindow = {};
		infowindow[place] = new google.maps.InfoWindow({
          content: contentString[place]
       });
        });
		marker[place].infowindow = infowindow[place];
	     marker[place].addListener('click', function() {
          return this.infowindow.open(map, this);
	}
	} 
	
	
	/* if (header == 'Name')
		{
			var local = places[place][header].split('/');
			arr[place] = {};
			arr[place].city = local[2];
		}	
		if (header == 'Country')
		{
				arr[place].country = places[place][header];
		}
		if (header == 'latitude')
				var lat = places[place][header];
		if (header == 'longitude')
				var lng = places[place][header];
		var loc = {lat: lat, lng: lng};
		if (header == 'position')
			var pos = places[place][header]
		if (header == 'genbank_id')
			var id = places[place][header];*/

(function(){

	"use strict"

	var map = {
		mapboxAccessToken: 'pk.eyJ1IjoibWF4ZGV2cmllczk1IiwiYSI6ImNqZWZydWkyNjF3NXoyd28zcXFqdDJvbjEifQ.Dl3DvuFEqHVAxfajg0ESWg',
		map: L.map('map', {
			zoomControl: false
		}),
		init: function () {
			// Set the original view of the map:
			this.map.setView([52.370216, 4.895168], 13);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.mapboxAccessToken, {
				maxZoom: 20,
				id: 'mapbox.streets'
			}).addTo(this.map);

			L.control.zoom({
				position: 'bottomright'
			})
			.addTo(this.map);

			this.data();
		},
		data: function() {
			var data = window.data;
			var rows = data.results.bindings;
			var streets = rows.map(function (item) {
				var streetName = item.name.value;
				var link = item.street.value;
				var slug = link.slice((link.indexOf('street/') + 7), link.lastIndexOf('/'));
				var geo = item.wkt.value;

				return {
					'type': 'Feature',
					'properties': {
						'streetName': streetName,
						'slug': slug,
						'link': link
					},
					'geometry': wellknown(geo)
				};
			});
			this.createCircle(streets);
		},
		createCircle: function(data) {
			var self = this;
			var selectRadius = document.querySelector("#radius-selected");
			var centerPoint = {lat: 52.370216, lng: 4.895168};

			//create circle
			var circle = L.circle([centerPoint.lat, centerPoint.lng], {
					color: 'red',
					fillColor: '#f03',
					fillOpacity: 0.4,
					clickable: false,
					radius: 1000/2,
					zIndexOffset: 1000
			}).addTo(self.map);

			//draggable
			circle.addEventListener('mousedown', function () {
				self.map.dragging.disable();
			});

			circle.addEventListener('mouseup', function () {
				self.map.dragging.enable();
			});

			circle.on({
				 mousedown: function () {
					 self.map.on('mousemove', function (e) {
						 centerPoint.lat = e.latlng.lat;
						 centerPoint.lng = e.latlng.lng;
						 circle.setLatLng(e.latlng);
					 });
				 }
			});
			self.map.on('mouseup',function(e){
				var userInput = circle.getRadius();
				map.createStreets(data, circle, userInput);
				self.map.removeEventListener('mousemove');
			})

			circle.bringToFront();

			selectRadius.addEventListener("change", function(el){
				changeRadius(el);
			})

			function changeRadius(el) {
				var meters = el.target.value / 2 * 1000;
				circle.setRadius(meters);
				map.createStreets(data, circle, meters);
			}

			map.createStreets(data, circle);
		},
		createStreets: function(data, circle, userInput) {
			var selectedStreets = [];
			var circle_lat_long = circle.getLatLng();
			var counter_points_in_circle = 0;
			var meters_user_set = userInput;
			if(meters_user_set == undefined){
				meters_user_set = 1000/2;
			}
			var geojsonMarkerOptions = {
				radius: 1
			};

			//create geoJSON layer
			var streets = L.geoJSON(data, {
				onEachFeature: function(feature, layer) {
					if(layer.feature.geometry.type !== "Point"){
						var bounds = layer.getBounds();
						var center = bounds.getCenter();
						var distance_from_layer_circle = center.distanceTo(circle_lat_long);

						if (distance_from_layer_circle <= meters_user_set) {
							var uri = feature.properties.link;
							selectedStreets.push(uri);
							counter_points_in_circle += 1;
						}
					}
				},
				style: function (feature) {
					return {
						zIndexOffset: 100,
						weight: 1,
						lineCap: 'square',
						lineJoin: 'square',
						className: feature.properties.slug
					}
				},
				pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, geojsonMarkerOptions); }
			})
			// .addTo(this.map)
			.on('mouseover', this.handleHoverOverStreet)
			.on('click', function (e) {
				events.handleClickOnStreet(e.layer.feature);
			});

			//Bring to back
			streets.bringToBack();

			//Count number of streets
			function removeDuplicates(arr){
		    let unique_array = []
		    for(var i = 0;i < arr.length; i++){
		    	if(unique_array.indexOf(arr[i]) == -1){
		      	unique_array.push(arr[i])
		       }
		    }
				console.log(unique_array);
		    return unique_array.length
			}
			var number_of_streets = document.querySelector('.count-streets');
			number_of_streets.innerHTML = removeDuplicates(selectedStreets) + " straten";
		},
		handleHoverOverStreet: function (e) {
			// var point = L.point(0, -5);
			//
			// L.popup({
			// 	closeButton: false,
			// 	offset: point
			// })
			// 	.setLatLng(e.latlng)
			// 	.setContent(e.layer.feature.properties.streetName)
			// 	.openOn(map.map);
		}
	};


	map.init()
})()

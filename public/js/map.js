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

			L.tileLayer('https://api.mapbox.com/styles/v1/maxdevries95/cjesmtkaj8iqs2rmoe0bo17w7/tiles/256/{z}/{x}/{y}?access_token=' + this.mapboxAccessToken, {
				maxZoom: 20,
				id: 'mapbox.streets'
			}).addTo(this.map);

			L.control.zoom({
				position: 'topright'
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

				// Parse the multiline string geometry into a readable array for Leaflet JS:
				var parseMultiLineString = function (str) {
				    str = str.replace('MULTILINESTRING((', '');
				    str = str.replace('LINESTRING(', '');
				    str = str.replace(')', '');
				    var pointsAsString = str.split(',');
						console.log(pointsAsString);
				    var points = pointsAsString.map(function (d) {
				      return d.split(' ');
				    });
						// console.log(points);
						// console.log(typeof points[0]);
				    return points;
				}

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
			this.radius();
			this.renderStreets(streets);
		},
		radius: function() {
			var self = this;
			var selectRadius = document.querySelector("#radius-selected");

			var circle = L.circle([52.370216, 4.895168], {
					color: 'red',
					fillColor: '#f03',
					fillOpacity: 0.1,
					clickable: false
			}).addTo(self.map);

			circle.setRadius(5);

			selectRadius.addEventListener("change", function(el){
				var radius = this.value;
				circle.setRadius(radius * 1000);
			})

		},
		renderStreets: function (data) {
			var geojsonMarkerOptions = {
				radius: 1
			};

			L.geoJSON(data, {
				style: function (feature) {
					return {
						weight: 1,
						lineCap: 'square',
						lineJoin: 'square',
						className: feature.properties.slug
					}
				},
				pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, geojsonMarkerOptions); }
			})
			.addTo(this.map)
			.on('mouseover', this.handleHoverOverStreet)
			.on('click', function (e) {
				events.handleClickOnStreet(e.layer.feature);
			});

		},
		setCurrentView: function (lat, lng) {
			this.map.setView([lat, lng], 17);
		},
		handleHoverOverStreet: function (e) {
			var point = L.point(0, -5);

			L.popup({
				closeButton: false,
				offset: point
			})
				.setLatLng(e.latlng)
				.setContent(e.layer.feature.properties.streetName)
				.openOn(map.map);
		},
		highlightStreet: function (slug) {
			var path = document.querySelectorAll('path');

			path.forEach(function (item) {
				if (item.classList.contains('active')) item.classList.remove('active');
				if (item.classList.contains(slug)) item.classList.add('active');
			});
		}
	};

  /* mapbox */
	// var map = {
	// 	init: function() {
	// 		this.create();
	// 	},
	// 	create: function() {
	// 		mapboxgl.accessToken = 'pk.eyJ1Ijoic3V1c3RlbnZvb3JkZSIsImEiOiJjamVmc3Q3MDQxbGJ0MzNrdHE4Y3QwMW82In0.AWAlzy0cXMbrfR8Ed-7DOg'
	// 		    var map = new mapboxgl.Map({
	// 		    container: 'map',
	// 		    style: 'mapbox://styles/mapbox/light-v9',
	// 		    center: [4.8776926, 52.3563219],
	// 		    zoom: '11'
	// 		})
	// 	}
	// }
	map.init()
})()

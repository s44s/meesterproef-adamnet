var wkt;

(function(){

	"use strict"

	var circleToPolygon = require('./circletopolygon.js');
	var toWKT = require('./towkt.js');

	var map = {
		mapboxAccessToken: 'pk.eyJ1IjoibWF4ZGV2cmllczk1IiwiYSI6ImNqZWZydWkyNjF3NXoyd28zcXFqdDJvbjEifQ.Dl3DvuFEqHVAxfajg0ESWg',
		map: L.map('map', {
			zoomControl: false
		}),
		circle: L.circle({
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.4,
			radius: 500/2
		}),
		polygon: L.polygon({
			color: 'blue'
		}),
		centerPoint: {
			lat: 52.370216,
			lng: 4.895168
		},
		init: function () {
			var self = this;
			// Set the original view of the map:
			this.map.setView(Object.values(this.centerPoint), 14);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.mapboxAccessToken, {
				maxZoom: 20,
				id: 'mapbox.streets'
			}).addTo(this.map);

			L.control.zoom({
				position: 'bottomright'
			}).addTo(this.map);

			this.createCircle(this.data());

			this.circle
				.setLatLng(Object.values(this.centerPoint))
				.setRadius(250)
				.addTo(this.map)
				.bringToFront();

			// Create the first polygon:
			var polygonCoords = circleToPolygon(Object.values(this.centerPoint), 250, 10);

			this.polygon
				.setLatLngs(polygonCoords.coordinates[0])
				.addTo(this.map)
				.bringToBack();
		},
		data: function() {
			var data = window.data;

			// Add geometry to data:
			data.forEach(function (street) {
				street.geometry = wellknown(street.geo);
			});

			return data;
		},
		createCircle: function(data) {
			var self = this;
			var selectRadius = document.querySelector("#radius-selected");

			// Change the map's draggable function when you drag the radius:
			this.circle.addEventListener('mousedown', function () {
				self.map.dragging.disable();
			});
			this.circle.addEventListener('mouseup', function () {
				self.map.dragging.enable();
			});

			// Dragging the circle:
			this.circle.on('mousedown', function () {
				self.map.on('mousemove', function (e) {
					self.circle.setLatLng(e.latlng);
				});
			});

			// Calculate the new center:
			this.circle.on('mouseup', function () {
				var latlng = self.circle.getLatLng();
				var radius = self.circle.getRadius();

				// Create the new polygon:
				self.createPolygon(latlng, radius);

				// self.distanceFromCenterPoint(data, latlng, radius);
				self.map.removeEventListener('mousemove');
			});

			selectRadius.addEventListener("change", function(e) {
				var latlng = self.circle.getLatLng();
				var meters = e.target.value / 2 * 1000;
				self.circle.setRadius(meters);
				self.createPolygon(latlng, meters);
				// self.distanceFromCenterPoint(data, self.centerPoint, meters);
			})

			// this.distanceFromCenterPoint(data, this.centerPoint);
		},
		createPolygon: function (coords, radius = 250, numberOfEdges = 10) {
			//leaflet polygon to wkt
			var polygonCoords = circleToPolygon([coords.lat, coords.lng], radius, numberOfEdges);

			this.polygon
				.setLatLngs(polygonCoords.coordinates[0]);

			wkt = toWKT(this.polygon);
			console.log('newWKT: ', wkt);
		},
		distanceFromCenterPoint: function(data, latlng, radius = 250) {
			var counterStreetsInCircle = 0;

			var selectedStreets = [];
			uniqueStreets.splice(0, uniqueStreets.length);

			// Count number of streets
			function removeDuplicates(arr){
				for(var i = 0;i < arr.length; i++){
					if(uniqueStreets.indexOf(arr[i]) == -1){
						uniqueStreets.push(arr[i]);
					 }
				}
			}

			//create geoJSON layer
			var streets = L.geoJSON(data, {
				onEachFeature: function(feature, layer) {
					if(layer.feature.geometry.type !== "Point"){
						var bounds = layer.getBounds();
						var center = bounds.getCenter();
						var distanceFromRadius = center.distanceTo(latlng);
						var percentageFromCenterPoint = Math.round((distanceFromRadius / radius) * 100);

						if (distanceFromRadius <= radius) {
							var street = {
								'uri': feature.properties.uri,
								'disToCenter': percentageFromCenterPoint
							};

							selectedStreets.push(street);
							// console.log('selectedStreets: ', selectedStreets);
							removeDuplicates(selectedStreets);
							counterStreetsInCircle++;
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
				}
			});

			var countStreets = document.querySelector('.count-streets');
			countStreets.textContent = uniqueStreets.length + " straten";
		}
	};

	map.init()
})()

module.exports = function () {
	return wkt;
};

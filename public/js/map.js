var uniqueStreets = [];

(function(){

	"use strict"

	var circleToPolygon = require('./circletopolygon.js');
	var toWKT = require('./towkt.js');

	var map = {
		mapboxAccessToken: 'pk.eyJ1IjoibWF4ZGV2cmllczk1IiwiYSI6ImNqZWZydWkyNjF3NXoyd28zcXFqdDJvbjEifQ.Dl3DvuFEqHVAxfajg0ESWg',
		map: L.map('map', {
			zoomControl: false
		}),
		centerPoint: {
			lat: 52.370216,
			lng: 4.895168
		},
		init: function () {
			// Set the original view of the map:
			this.map.setView([this.centerPoint.lat, this.centerPoint.lng], 14);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.mapboxAccessToken, {
				maxZoom: 20,
				id: 'mapbox.streets'
			}).addTo(this.map);

			L.control.zoom({
				position: 'bottomright'
			}).addTo(this.map);

			this.createCircle(this.data());
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

			//create circle
			var circle = L.circle([this.centerPoint.lat, this.centerPoint.lng], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.4,
				radius: 500/2
			}).addTo(this.map);

			//circle to polygon
			var coordinatesPolygon = [52.370216,4.895168];
			var radiusPolygon = 250; // in meters
			var numberOfEdges = 10; //optional that defaults to 32
			var polygon = circleToPolygon(coordinatesPolygon, radiusPolygon, numberOfEdges);
			//create polygon in leaflet
			var polygonLeaflet = L.polygon(polygon.coordinates[0], {color: 'blue'}).addTo(this.map);
			//leaflet polygon to wkt
			console.log(toWKT(polygonLeaflet));

			// Change the map's draggable function when you drag the radius:
			circle.addEventListener('mousedown', function () {
				self.map.dragging.disable();
			});
			circle.addEventListener('mouseup', function () {
				self.map.dragging.enable();
			});

			// Dragging the circle:
			circle.on('mousedown', function () {
				self.map.on('mousemove', function (e) {
					circle.setLatLng(e.latlng);
					coordinatesPolygon = e.latlng;
				});
			});

			// Calculate the new center:
			circle.on('mouseup', function () {
				var latlng = circle.getLatLng();
				var radius = circle.getRadius();
				self.distanceFromCenterPoint(data, latlng, radius);
				self.map.removeEventListener('mousemove');
			});

			selectRadius.addEventListener("change", function(e){
				changeRadius(e);
			})

			function changeRadius(e) {
				var meters = e.target.value / 2 * 1000;
				circle.setRadius(meters);
				radiusPolygon = meters;
				self.distanceFromCenterPoint(data, self.centerPoint, meters);
			}

			this.distanceFromCenterPoint(data, this.centerPoint);
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

module.exports = uniqueStreets;

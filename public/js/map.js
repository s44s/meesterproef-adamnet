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
			this.map.setView([this.centerPoint.lat, this.centerPoint.lng], 14);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.mapboxAccessToken, {
				maxZoom: 20,
				id: 'mapbox.streets'
			}).addTo(this.map);

			L.control.zoom({
				position: 'bottomright'
			}).addTo(this.map);

			this.createCircle(this.data());

			// Create the first polygon:
			var polygonCoords = circleToPolygon([self.centerPoint.lat, self.centerPoint.lng], 250, 10);

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

			//create circle
			var circle = L.circle([this.centerPoint.lat, this.centerPoint.lng], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.4,
				radius: 500/2
			}).addTo(this.map);

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
				});
			});

			// Calculate the new center:
			circle.on('mouseup', function () {
				var latlng = circle.getLatLng();
				var radius = circle.getRadius();

				// Create the new polygon:
				self.createPolygon(latlng, radius);

				self.distanceFromCenterPoint(data, latlng, radius);
				self.map.removeEventListener('mousemove');
			});

			selectRadius.addEventListener("change", function(e){
				changeRadius(e);
			})

			function changeRadius(e) {
				var latlng = circle.getLatLng();
				var meters = e.target.value / 2 * 1000;
				circle.setRadius(meters);
				self.createPolygon(latlng, meters);
				self.distanceFromCenterPoint(data, self.centerPoint, meters);
			}

			this.distanceFromCenterPoint(data, this.centerPoint);
		},
		createPolygon: function (coords, radius = 250, numberOfEdges = 10) {
			console.log('coords: ', coords);
			console.log('radius: ', radius);
			console.log('numberOfEdges: ', numberOfEdges);

			//leaflet polygon to wkt
			var polygonCoords = circleToPolygon([coords.lat, coords.lng], radius, numberOfEdges);

			console.log('new coords: ', polygonCoords.coordinates[0]);

			this.polygon
				.setLatLngs(polygonCoords.coordinates[0]);
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

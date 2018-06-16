// Require JS files:
var circleToPolygon = require('./circletopolygon.js');
var toWKT = require('./towkt.js');

// Set global wkt variable:
var inputCircle;

(function(){

	"use strict"

	var map = {
		mapboxAccessToken: 'pk.eyJ1IjoibWF4ZGV2cmllczk1IiwiYSI6ImNqZWZydWkyNjF3NXoyd28zcXFqdDJvbjEifQ.Dl3DvuFEqHVAxfajg0ESWg',
		map: L.map('map', {
			zoomControl: false
		}),
		circle: L.circle({
			color: '#DA121A',
			fillColor: '#DA121A',
			fillOpacity: 0.4,
			radius: 500/2
		}),
		polygon: L.polygon({
			color: '#DA121A'
		}),
		centerPoint: [
			52.370216,
			4.895168
		],
		init: function () {
			var self = this;

			// Set the original view of the map:
			this.map.setView(this.centerPoint, 14);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.mapboxAccessToken, {
				minZoom: 11,
				maxZoom: 20,
				id: 'mapbox.light'
			}).addTo(this.map);

			L.control.zoom({
					position: 'bottomright'
			}).addTo(this.map);

			// Initialize the circle:
			this.circle
				.setLatLng(this.centerPoint)
				.setRadius(250)
				.addTo(this.map);

			// Initialize circle events:
			this.changeRadius();
			this.moveCircle();

			// Change the map's draggable function when you drag the radius:
			this.circle.addEventListener('mousedown', function () {
				self.map.dragging.disable();
			});
			this.circle.addEventListener('mouseup', function () {
				self.map.dragging.enable();
			});

			// Create the polygon, with the centerPoint as coords:
			this.createPolygon(this.centerPoint);
		},
		changeRadius: function () {
			var self = this;
			var selectRadius = document.querySelector("#radius-selected");

			selectRadius.addEventListener("change", function(e) {
				var latlng = self.circle.getLatLng();
				var meters = e.target.value / 2 * 1000;
				self.createCircle(Object.values(latlng), meters);
				self.createPolygon(Object.values(latlng), meters);
			});
		},
		moveCircle: function () {
			var self = this;

			// Dragging the circle:
			this.circle.on('mousedown', function () {
				self.map.on('mousemove', function (e) {
					self.createCircle(Object.values(e.latlng));
				});
			});

			// Calculate the new center:
			this.circle.on('mouseup', function () {
				var latlng = this.getLatLng();
				var radius = this.getRadius();

				// Create the new polygon:
				self.createPolygon(Object.values(latlng), radius);
				self.map.removeEventListener('mousemove');
			});
		},
		createCircle: function (coords, radius = this.circle.getRadius()) {
			this.circle.setLatLng(coords);
			this.circle.setRadius(radius);
		},
		createPolygon: function (coords, radius = 250, numberOfEdges = 10) {
			//leaflet polygon to wkt
			var polygonCoords = circleToPolygon(coords, radius, numberOfEdges);

			// Set the new coords:
			this.polygon
				.setLatLngs(polygonCoords.coordinates[0]);

			// Create a wkt from the polygon:
			inputCircle = {
				wkt: toWKT(this.polygon),
				coords: coords
			};
		}
	};

	map.init()
})()

module.exports = function () {
	return inputCircle;
};

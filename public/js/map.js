// Require JS files:
var circleToPolygon = require('./circletopolygon.js');
var toWKT = require('./towkt.js');

// Set global wkt variable:
var wkt;

(function(){

	"use strict"

	var map = {
		mapboxAccessToken: 'pk.eyJ1IjoibWF4ZGV2cmllczk1IiwiYSI6ImNqZWZydWkyNjF3NXoyd28zcXFqdDJvbjEifQ.Dl3DvuFEqHVAxfajg0ESWg',
		map: L.map('map'),
		circle: L.circle({
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.4,
			radius: 500/2
		}),
		polygon: L.polygon({
			color: 'blue'
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
				id: 'mapbox.streets'
			}).addTo(this.map);

			this.createCircle();

			this.circle
				.setLatLng(this.centerPoint)
				.setRadius(250)
				.addTo(this.map)
				.bringToFront();

			// Initialize polygon:
			this.polygon
				.addTo(this.map)
				.bringToBack();

			// Create the polygon, with the centerPoint as coords:
			this.createPolygon(this.centerPoint);
		}
		createCircle: function() {
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
				// var latlng = self.circle.getLatLng();
				// var radius = self.circle.getRadius();
				var latlng = this.getLatLng();
				var radius = this.getRadius();

				console.log(latlng);
				console.log(radius);

				// Create the new polygon:
				self.createPolygon(Object.values(latlng), radius);

				self.map.removeEventListener('mousemove');
			});

			selectRadius.addEventListener("change", function(e) {
				var latlng = self.circle.getLatLng();
				var meters = e.target.value / 2 * 1000;
				self.circle.setRadius(meters);
				self.createPolygon(Object.values(latlng), meters);
			})
		},
		createPolygon: function (coords, radius = 250, numberOfEdges = 10) {
			//leaflet polygon to wkt
			var polygonCoords = circleToPolygon(coords, radius, numberOfEdges);

			// Set the new coords:
			this.polygon
				.setLatLngs(polygonCoords.coordinates[0]);

			// Create a wkt from the polygon:
			wkt = toWKT(this.polygon);
		}
	};

	map.init()
})()

module.exports = function () {
	return wkt;
};

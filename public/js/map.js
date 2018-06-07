var selectedStreets = [];

(function(){

	"use strict"

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

			var latlng = circle.getLatLng();

			//
			circle.on('mouseup', function () {
				latlng = circle.getLatLng();
				var radius = circle.getRadius();
				self.distanceFromCenterPoint(data, latlng, radius);
				self.map.removeEventListener('mousemove');
			});

			selectRadius.addEventListener("change", function(el){
				changeRadius(el);
			})

			function changeRadius(el) {
				var meters = el.target.value / 2 * 1000;
				circle.setRadius(meters);
				self.distanceFromCenterPoint(data, latlng, meters);
			}

			this.distanceFromCenterPoint(data, latlng);
		},
		distanceFromCenterPoint: function(data, latlng, radius = 250) {
			var counterStreetsInCircle = 0;

			selectedStreets.splice(0, selectedStreets.length);

			//Count number of streets
			function removeDuplicates(arr){
				let unique_array = []
				for(var i = 0;i < arr.length; i++){
					if(unique_array.indexOf(arr[i]) == -1){
						unique_array.push(arr[i]);
					 }
				}
				return unique_array;
			}

			//create geoJSON layer
			var streets = L.geoJSON(data, {
				onEachFeature: function(feature, layer) {
					if(layer.feature.geometry.type !== "Point"){
						var bounds = layer.getBounds();
						var center = bounds.getCenter();
						var distanceFromRadius = center.distanceTo(latlng);

						if (distanceFromRadius <= radius) {
							selectedStreets.push(feature.properties.uri);
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
			countStreets.textContent = selectedStreets.length + " straten";
		}
	};

	map.init()
})()

module.exports = selectedStreets;

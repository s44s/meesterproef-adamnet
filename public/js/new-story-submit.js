var selectedStreets = require('./map.js');

console.log(selectedStreets);

(function () {
  var newStory = {
    form: document.querySelector('.location-and-timestamp'),
    timestampMin: document.querySelector('[name="timestamp-min"]'),
    timestampMax: document.querySelector('[name="timestamp-max"]'),
    init: function () {
      var self = this;
      self.form.addEventListener('submit', function (e) {
        e.preventDefault();

        var valMin = Number(self.timestampMin.value);
        var valMax = Number(self.timestampMax.value);

        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        fd.append('valMin', valMin);
        fd.append('valMax', valMax);
        fd.append('selectedStreets', selectedStreets);

        xhr.open('post', '/create-story');
        xhr.send(fd);
      });
    }
  };

  newStory.init();
})();




// function sendData(data) {
//   var xhr = new XMLHttpRequest();
//
//   var fd = new FormData();
//
//   console.log(fd);
//
//   xhr.addEventListener('error', function (e) {
//     console.log('error');
//   });
//
//   xhr.open('POST', '/create-story');
//
//   xhr.send(fd);
// }
//
// var form = document.querySelector('.location-and-timestamp');
//
// form.addEventListener('submit', function (e) {
//   e.preventDefault();
//   sendData();
// });

module.exports = selectedStreets;

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

        var data = {
          'valMin': valMin,
          'valMax': valMax,
          'selectedStreets': selectedStreets
        };

        var config = {
          method: 'POST',
          body: JSON.stringify(data),
          redirect: 'follow',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };

        console.log(config);

        fetch('/create-story', config)
          .then(function (data) {
            console.log(data);
            window.location.replace('/create-story');
          })
          .catch(function (err) {
            throw err;
          });
      });
    }
  };

  newStory.init();
})();

(function () {

  'use strict';

  var searchLocation = {
    currentFocus: 0,
    init: function (searchbar) {
      var self = this;

      // Event listener for input value:
      searchbar.addEventListener('input', function (e) {
        self.closeAllLists();
        if (!this.value) return false;
        self.currentFocus = -1;
        self.getAutocomplete(data, this.value);
      });

      // Event listener for keyboard functions:
      searchbar.addEventListener('keydown', function (e) {
        var x = document.getElementById(this.id + 'autocomplete-list');

        if (x) x = x.querySelectorAll('li');

        switch (e.keyCode) {
          case 40:
            self.currentFocus++;
            self.addActive(x);
            break;
          case 38:
            self.currentFocus--;
            self.addActive(x);
            break;
          case 13:
            e.preventDefault();
            if (self.currentFocus > -1) {
              if (x) x[self.currentFocus].children[0].click();
            }
        }
      });

      // Event listener when clicking the document:
      document.addEventListener('click', function (e) {
        self.closeAllLists(e.target);
      });
    },
    getAutocomplete: function (data, val) {
      // Check what data matches the search query:
      var results = data.filter(function (str) {
        if (str.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          return str;
        }
      });
      this.setAutocomplete(results);
    },
    setAutocomplete: function () {

    },
    addActive: function () {

    },
    removeActive: function () {

    },
    closeAllLists: function () {

    }
  };

})();

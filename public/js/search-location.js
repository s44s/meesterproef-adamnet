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

    },
    getAutocomplete: function () {

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

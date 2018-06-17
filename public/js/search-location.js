(function () {

  'use strict';

  var searchLocation = {
    currentFocus: 0,
    init: function (searchbar) {
      var self = this;

      // Add the given searchbar to this object:
      this.searchbar = searchbar;

      // Event listener for input value:
      this.searchbar.addEventListener('input', function (e) {
        self.closeAllLists();
        if (!this.value) return false;
        self.currentFocus = -1;
        self.getAutocomplete(data, this.value);
      });

      // Event listener for keyboard functions:
      this.searchbar.addEventListener('keydown', function (e) {
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
    setAutocomplete: function (results) {
      var self = this;
      var ul = document.createElement('ul');

      ul.setAttribute('id', this.searchbar.id + 'autocomplete-list');
      ul.setAttribute('class', 'autocomplete-items');

      this.searchbar.parentNode.appendChild(ul);

      results.forEach(function (result, i) {
        if (i < 2) {
          var li = document.createElement('li');
          var radio = document.createElement('input').type = 'radio';
          var label = document.createElement('label');

          ul.appendChild(li);

          radio.setAttribute('id', result);
          radio.name = 'wkt';
          radio.value = result;
          li.appendChild(radio);

          label.setAttribute('for', result);
          label.textContent = result;
          li.appendChild(label);

          radio.addEventListener('change', function (e) {
            e.preventDefault();
            if (radio.checked == true) {
              self.searchbar.value = this.nextElementSibling.textContent;
              self.closeAllLists();
              // Handle click on street here
            }
          });
        }
      });
    },
    addActive: function (x) {
      if (!x) return false;
      this.removeActive(x);
      if (this.currentFocus >= x.length) this.currentFocus = 0;
      if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
      x[this.currentFocus].children[0].classList.add('autocomplete-active');
    },
    removeActive: function (x) {
      for (var i = 0; i < x.length; i++) {
        x[i].children[0].classList.remove('autocomplete-active');
      }
    },
    closeAllLists: function () {

    }
  };

})();

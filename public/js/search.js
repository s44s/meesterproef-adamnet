(function () {

  'use strict';

  var search = {
    currentFocus: 0,
    init: function (searchbar, data) {
      var self = this;

      // Add the given searchbar to this object:
      this.searchbar = searchbar;

      // Event listener for input value:
      this.searchbar.addEventListener('input', function () {
        self.closeList();
        if (!this.value) return false;
        self.currentFocus = -1;
        self.getAutocomplete(data, this.value);
      });

      // Event listener for keyboard functions:
      this.searchbar.addEventListener('keydown', function (e) {
        var list = document.querySelector('.autocomplete-items');

        if (list) list = list.querySelectorAll('li');

        switch (e.keyCode) {
          case 40:
            self.currentFocus++;
            self.addActive(list);
            break;
          case 38:
            self.currentFocus--;
            self.addActive(list);
            break;
          case 13:
            e.preventDefault();
            if (self.currentFocus > -1) {
              if (list) list[self.currentFocus].children[0].click();
            }
        }
      });

      // Event listener when clicking the document:
      document.addEventListener('click', function (e) {
        self.closeList(e.target);
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
      var autocomplete = document.querySelector('.autocomplete');
      var ul = document.createElement('ul');

      ul.setAttribute('class', 'autocomplete-items');

      autocomplete.appendChild(ul);

      results.forEach(function (result, i) {
        if (i < 10) {
          var li = document.createElement('li');
          var a = document.createElement('a');

          ul.appendChild(li);

          a.textContent = result;
          a.href = '#';
          li.appendChild(a);

          li.addEventListener('click', function (e) {
            e.preventDefault();
            self.searchbar.value = this.textContent;
            self.closeList();
          });
        }
      });
    },
    addActive: function (list) {
      if (!list) return false;
      this.removeActive(list);
      if (this.currentFocus >= list.length) this.currentFocus = 0;
      if (this.currentFocus < 0) this.currentFocus = (list.length - 1);
      list[this.currentFocus].children[0].classList.add('autocomplete-active');
    },
    removeActive: function (list) {
      for (var i = 0; i < list.length; i++) {
        list[i].children[0].classList.remove('autocomplete-active');
      }
    },
    closeList: function (el) {
      var list = document.querySelector('.autocomplete-items');

      if (el != list && el != this.searchbar) {
        list.parentNode.removeChild(list);
      }
    }
  };

  module.exports = search;

})();

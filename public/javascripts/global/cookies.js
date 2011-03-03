function setCookie(name, value) {
  var exdays = 20 * 365; // 20 years
  var exdate = new Date();

  exdate.setDate(exdate.getDate() + exdays);

  var value = escape(value) + ((exdays == null) ? '' : '; expires=' + exdate.toUTCString());

  document.cookie = name + '=' + value;
}

function getCookie(name) {
  var i, x, y, ARRcookies = document.cookie.split(';');

  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
    x = x.replace(/^\s+|\s+$/g, '');
    if (x == name) { return unescape(y) }
  }
}
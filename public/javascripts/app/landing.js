$(document).ready(function() {
  var emailRegexp  = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var landingForm  = $('#landing_form');
  var userEmail    = $('#user_email');
  var userPassword = $('#user_password');

  function vibrateLanding() { $('.landing').vibrate({ frequency: 5000, spread: 5, duration: 600 }) };

  function highlightField(field) {
    if ((field.attr('placeholder') !== field.val()) && (field.val() !== '')) {
      field.css('color', 'red');
      setTimeout(function() { field.css('color', '') }, 600);
    }
  }

  landingForm.live('ajax:beforeSend', function(xhr, settings) {
    if (emailRegexp.test(userEmail.val())) {
      $('.landing_form_email').hide();
      $('.landing_form_password').show();
    } else {
      vibrateLanding()
      highlightField(userEmail);

      return false;
    }
  })

  landingForm.live('ajax:success', function(data, status, xhr) {
    if (status === true) {
      window.location = rootPath;
    } else if (status === false) {
      vibrateLanding();
      highlightField(userPassword);
    } else {
      userPassword.attr('disabled', '');
    }
  })

  userEmail.placeholder();

  $.getJSON(jsonLandingPath, function(markets) {
    var geoPoint, placemark;

    $.each(markets, function(index, market) {
      geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
      placemark = new YMaps.Placemark(geoPoint, { style: market.category.icon_style });
      yandexMaps.addOverlay(placemark);
    });
  });
});

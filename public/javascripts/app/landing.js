$(document).ready(function() {
  var emailRegexp    = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var userEmail      = $('#user_email');
  var vibrateOptions = { frequency: 5000, spread: 5, duration: 600 };

  var landingForm  = $('#landing_form');
  var userPassword = $('#user_password');

  var editUserForm = $('#edit_user_form');

  function highlightField(field) {
    if ((field.attr('placeholder') !== field.val()) && (field.val() !== '')) {
      field.css('color', 'red');
      setTimeout(function() { field.css('color', '') }, 600);
    }
  };

  $.getJSON(jsonLandingPath, function(markets) {
    var geoPoint, placemark;

    $.each(markets, function(index, market) {
      geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
      placemark = new YMaps.Placemark(geoPoint, { style: market.category.icon_style });
      yandexMaps.addOverlay(placemark);
    });
  });

  function vibrateLanding() { $('.landing').vibrate(vibrateOptions) };

  landingForm.live('ajax:beforeSend', function(xhr, settings) {
    if (emailRegexp.test(userEmail.val())) {
      $('.landing_form_email').hide();
      $('.landing_form_password').show();
    } else {
      vibrateLanding()
      highlightField(userEmail);

      return false;
    }
  });

  landingForm.live('ajax:success', function(data, status, xhr) {
    if (status === true) {
      window.location = rootPath;
    } else if (status === false) {
      vibrateLanding();
      highlightField(userPassword);
    } else {
      userPassword.attr('disabled', '');
      userPassword.focus();
    }
  });

  userEmail.placeholder();

  function vibrateEditUser() { $('.b-edit_user_wrap').vibrate(vibrateOptions) };

  editUserForm.live('ajax:beforeSend', function(xhr, settings) {
    var existsInvalidFields = false;
    var invalidEmail        = false;

    if (!($.trim($('#user_name').val()))) { existsInvalidFields = true };

    if (!(emailRegexp.test(userEmail.val()))) {
      existsInvalidFields = true;
      invalidEmail        = true;
    }

    if (!($.trim($('#user_phone').val()))) { existsInvalidFields = true };

    if (existsInvalidFields) {
      vibrateEditUser(vibrateOptions);
      if (invalidEmail) { highlightField(userEmail) };

      return false;
    }
  });

  editUserForm.live('ajax:success', function(data, status, xhr) {
    if (status === true) {
      window.location = rootPath;
    } else if (status === false) {
      vibrateEditUser();
      highlightField(userEmail);
      $('.existing_email').show().delay(500).fadeOut('100');
    }
  });
});
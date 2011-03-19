$(document).ready(function() {
  var emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var landingForm = $('#landing_form');
  var userEmail   = $('#user_email');

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
    if (status) {
      vibrateLanding();
      highlightField($('#user_password'));
    }
  })

  userEmail.placeholder();
});

jQuery(function() {
  var map         = new YMaps.Map(document.getElementById('yandex_maps'));
  var zoomControl = new YMaps.Zoom({ customTips: [{ index: 9,  value: 'Город' },
                                                  { index: 13, value: 'Улица' },
                                                  { index: 16, value: 'Дом' }] });
  var typeControl   = new YMaps.TypeControl();
  var geocoder      = new YMaps.Geocoder('Новосибирск');
  var style         = new YMaps.Style();
  var template      = "<div><b>$[title]</b> | $[category]</div> \
                       <div>$[discount]</div> \
                       <div>$[time]</div> \
                       <div>$[phone] <a href='$[website]'>$[website]</a> <a href='mailto:$[email]'>$[email]</a></div>"

  style.balloonContentStyle = new YMaps.BalloonContentStyle(new YMaps.Template(template));

  map.addControl(zoomControl);
  map.addControl(typeControl);

  YMaps.Events.observe(geocoder, geocoder.Events.Load, function() {
    map.setCenter(this.get(0).getGeoPoint(), 10);
  })

  jQuery.getJSON('/', function(markets) {
    jQuery.each(markets, function(index, market) {
      style.iconStyle = YMaps.Styles.get(market.category.icon_style).iconStyle;

      var geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
      var placemark = new YMaps.Placemark(geoPoint, { hideIcon: false,
                                                      style:    style })

      placemark.title    = market.title;
      placemark.category = market.category.title;
      placemark.discount = market.discount;
      placemark.time     = market.time;
      placemark.phone    = market.phone;
      placemark.website  = market.website;
      placemark.email    = market.email;

      map.addOverlay(placemark);
    })
  })

  jQuery('#dialog_form').submit(function() {
    var email = jQuery(this).find('#user_email');

    if (validateEmail(email)) {
      jQuery.post(jQuery(this).attr('action'), jQuery(this).serialize());
      disableDialogWindow();
      setCookie('left_email', true);
    } else {
      var class_name = 'invalid';

      email.addClass(class_name);
      setTimeout(function() { email.removeClass(class_name) }, 1200);
    }

    return false;
  })

  function disableDialog() {
    jQuery('#overlay, #dialog').hide();
  }

  if (getCookie('left_email')) { disableDialog() };
})
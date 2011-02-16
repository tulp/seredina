YMaps.jQuery(function () {
  var map         = new YMaps.Map(document.getElementById('yandex_maps'));
  var zoomControl = new YMaps.Zoom({ customTips: [{ index: 9,  value: 'Город' },
                                                  { index: 13, value: 'Улица' },
                                                  { index: 16, value: 'Дом' }] });
  var typeControl   = new YMaps.TypeControl();
  var searchControl = new YMaps.SearchControl();
  var geocoder      = new YMaps.Geocoder('Новосибирск');
  var style         = new YMaps.Style();
  var template      = "<div><b>$[title]</b> | $[category]</div> \
                       <div>$[discount]</div> \
                       <div>$[time]</div> \
                       <div>$[phone] <a href='$[website]'>$[website]</a> <a href='mailto:$[email]'>$[email]</a></div>"

  style.balloonContentStyle = new YMaps.BalloonContentStyle(new YMaps.Template(template));

  map.addControl(zoomControl);
  map.addControl(typeControl);
  map.addControl(searchControl);

  YMaps.Events.observe(geocoder, geocoder.Events.Load, function () {
    map.setCenter(this.get(0).getGeoPoint(), 10);
  })

  // var toolBar = new YMaps.ToolBar();
  // toolBar.add(new GeolocatorButton());
  // map.addControl(toolBar);

  YMaps.jQuery.getJSON('/', function (markets) {
    YMaps.jQuery.each(markets, function (index, market) {
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
})
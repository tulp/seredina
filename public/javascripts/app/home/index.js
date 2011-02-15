YMaps.jQuery(function () {
  var map         = new YMaps.Map(document.getElementById('yandex_maps'));
  var zoomControl = new YMaps.Zoom({ customTips: [{ index: 9,  value: 'Город' },
                                                  { index: 13, value: 'Улица' },
                                                  { index: 16, value: 'Дом' }] });
  var typeControl   = new YMaps.TypeControl();
  var searchControl = new YMaps.SearchControl();
  var geocoder      = new YMaps.Geocoder('Новосибирск');

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
      var geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
      var placemark = new YMaps.Placemark(geoPoint, { hideIcon: false,
                                                      style:    market.category.icon_style })
      map.addOverlay(placemark);
    })
  })
})
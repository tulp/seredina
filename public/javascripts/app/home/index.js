YMaps.jQuery(function () {
  var map         = new YMaps.Map(document.getElementById('yandex_maps'));
  var zoomControl = new YMaps.Zoom({ customTips: [{ index: 9,  value: 'Город' },
                                                  { index: 13, value: 'Улица' },
                                                  { index: 17, value: 'Дом' }] });
  var typeControl   = new YMaps.TypeControl();
  var searchControl = new YMaps.SearchControl();

  map.addControl(zoomControl);
  map.addControl(typeControl);
  map.addControl(searchControl);

  map.setCenter(new YMaps.GeoPoint(37.64, 55.76), 10);
})

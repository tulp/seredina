$(document).ready(function() {
  var zoomControlOptions  = { customTips: [{ index: 9, value: 'Город' }, { index: 13, value: 'Улица' }, { index: 16, value: 'Дом' }] };
  var zoomControl         = new YMaps.Zoom(zoomControlOptions);
  var zoomControlPosition = new YMaps.ControlPosition(YMaps.ControlPosition.TOP_RIGHT, new YMaps.Point(5, 50));

  var typeControl = new YMaps.TypeControl();

  var defaultCity = 'Новосибирск';
  var geocoder    = new YMaps.Geocoder(defaultCity);

  yandexMaps = new YMaps.Map(document.getElementById('yandex_maps'));

  YMaps.Events.observe(geocoder, geocoder.Events.Load, function() { yandexMaps.setCenter(this.get(0).getGeoPoint(), 10) });

  yandexMaps.addControl(zoomControl, zoomControlPosition);
  yandexMaps.addControl(typeControl);
})
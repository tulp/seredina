var yandexMaps, yandexMapsStyle;

j(document).ready(function() {
  var zoomControlOptions = { customTips: [{ index: 9, value: 'Город' }, { index: 13, value: 'Улица' }, { index: 16, value: 'Дом' }] };
  var zoomControl        = new YMaps.Zoom(zoomControlOptions);

  var typeControl = new YMaps.TypeControl();

  var template                      = "<div><b>$[title]</b></div> \
                                       <div>$[discount]</div> \
                                       <div>$[time]</div> \
                                       <div>$[phone] <a href='$[website]'>$[website]</a> <a href='mailto:$[email]'>$[email]</a></div>";
  var yandexMapsTemplate            = new YMaps.Template(template);
  var yandexMapsBalloonContentStyle = new YMaps.BalloonContentStyle(yandexMapsTemplate);


  var defaultCity = 'Новосибирск';
  var geocoder    = new YMaps.Geocoder(defaultCity);

  yandexMaps = new YMaps.Map(document.getElementById('yandex_maps'));

  YMaps.Events.observe(geocoder, geocoder.Events.Load, function() { yandexMaps.setCenter(this.get(0).getGeoPoint(), 10) });

  yandexMapsStyle                     = new YMaps.Style();
  yandexMapsStyle.balloonContentStyle = yandexMapsBalloonContentStyle;

  yandexMaps.addControl(zoomControl);
  yandexMaps.addControl(typeControl);
})
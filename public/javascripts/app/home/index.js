j(document).ready(function() {
  var leftEmailCookie = 'left_email';

  function disableDialog() {
    j('#overlay').hide();
  }

  function drawCategoriesLinks(categories) {
    var categorySelector   = j('#category_selector');
    var categorySelectorUl = categorySelector.find('ul');

    j.each(categories, function(index) {
      var image_url = YMaps.Styles.get(this.icon_style).iconStyle.href;
      var title     = this.title;
      var html      = "<li><a href='#' class='category_link'><div><img src='" + image_url + "'/>" + title + "</div></a></li>";

      categorySelectorUl.append(html);
    });

    categorySelector.show();

    j('.category_link').click(function() {
      var filter = j(this).text();

      if (filter === 'Все') { drawMarkets(categories) } else { drawMarkets(categories, filter) }

      return false;
    })
  }

  function drawMarkets(categories, filter) {
    var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();

    if (!(filter === undefined)) {
      categories = j.map(categories, function (category) {
        if (category.title === filter) { return category }
      })
    }

    yandexMaps.removeAllOverlays();

    j.each(categories, function(index) {
      yandexMapsStyle.iconStyle = YMaps.Styles.get(this.icon_style).iconStyle;
      var placemarkOptions      = { hideIcon: false, style: yandexMapsStyle };

      j.each(this.markets, function(index) {
        var geoPoint  = new YMaps.GeoPoint(this.longitude, this.latitude);
        var placemark = new YMaps.Placemark(geoPoint, placemarkOptions);

        yandexMapsGeoCollectionBounds.add(geoPoint);

        placemark.title    = this.title;
        placemark.discount = this.discount;
        placemark.time     = this.time;
        placemark.phone    = this.phone;
        placemark.website  = this.website;
        placemark.email    = this.email;

        yandexMaps.addOverlay(placemark);
      })
    })

    yandexMaps.setBounds(yandexMapsGeoCollectionBounds);
  }

  j.getJSON('/', function(categories) {
    drawCategoriesLinks(categories);
    drawMarkets(categories);
  })

  j('#dialog_form').submit(function() {
    var email = j(this).find('#user_email');

    if (validateEmail(email)) {
      j.post(j(this).attr('action'), j(this).serialize());
      setCookie(leftEmailCookie, true);
      disableDialog();
    } else {
      j('#dialog').vibrate({ frequency: 5000, spread: 5, duration: 600 });
    }

    return false;
  })

  j('#user_email').placeholder();

  if (getCookie(leftEmailCookie)) { disableDialog() }
})
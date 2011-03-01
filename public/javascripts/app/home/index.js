j(document).ready(function() {
  var leftEmailCookie = 'left_email';

  function disableDialog() {
    j('#overlay').hide();
  }

  function drawCategoriesLinks(categories) {
    var categorySelector   = j('#category_selector');
    var categorySelectorUl = categorySelector.find('ul');

    j.each(categories, function(index) {
      var imageUrl = YMaps.Styles.get(this.icon_style).iconStyle.href;
      var title    = this.title;
      var template = "<li><a href='#' class='category_link'><div><img src='${imageUrl}'/>${title}</div></a></li>"

      j.tmpl(template, { 'imageUrl': imageUrl, 'title': title }).appendTo(categorySelectorUl);
    })

    categorySelector.show();

    j('.category_link').click(function() {
      var filter = j(this).text();

      if (filter === 'Все') { drawMarkets(categories) } else { drawMarkets(categories, filter) }

      return false;
    })
  }

  function drawMarkets(categories, filter) {
    var yandexMapsStyle               = new YMaps.Style();
    var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();

    if (!(filter === undefined)) {
      categories = j.map(categories, function (category) {
        if (category.title === filter) { return category }
      })
    }

    yandexMaps.removeAllOverlays();

    j.each(categories, function(index) {
      yandexMapsStyle.iconStyle = YMaps.Styles.get(this.icon_style).iconStyle;
      var placemarkOptions      = { hideIcon: false, hasBalloon: false, style: yandexMapsStyle };

      j.each(this.markets, function(index, market) {
        var geoPoint  = new YMaps.GeoPoint(this.longitude, this.latitude);
        var placemark = new YMaps.Placemark(geoPoint, placemarkOptions);

        yandexMapsGeoCollectionBounds.add(geoPoint);

        yandexMaps.addOverlay(placemark);

        YMaps.Events.observe(placemark, placemark.Events.Click, function() {
          var marketInformation         = j('#market_information');
          var marketInformationTemplate = j('#market_information_template').html();

          marketInformation.html(j.tmpl(marketInformationTemplate, market));
          marketInformation.show();
        })
      })
    })

    yandexMaps.setBounds(yandexMapsGeoCollectionBounds);
  }

  function highlightEmail(email) {
    if ((email.attr('placeholder') !== email.val()) && (email.val() !== '')) {
      email.css('color', 'red');
      setTimeout(function() { email.css('color', '') }, 600);
    }
  }

  j.getJSON('/', function(categories) {
    drawCategoriesLinks(categories);
    drawMarkets(categories);
  })

  j('#dialog_form').submit(function() {
    var email = j('#user_email');

    if (validateEmail(email)) {
      j.post(j(this).attr('action'), j(this).serialize());
      setCookie(leftEmailCookie, true);
      disableDialog();
    } else {
      j('#dialog').vibrate({ frequency: 5000, spread: 5, duration: 600 });
      highlightEmail(email);
    }

    return false;
  })

  j('#user_email').placeholder();

  if (getCookie(leftEmailCookie)) { disableDialog() }
})
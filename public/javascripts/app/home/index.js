$(document).ready(function() {
  var leftEmailCookie = 'left_email';
  var userEmail       = $('#user_email');

  function disableDialog() {
    $('#overlay').hide();
  }

  function drawCategoriesLinks(categories) {
    var categorySelector   = $('#category_selector');
    var categorySelectorUl = categorySelector.find('ul');

    $.each(categories, function(index) {
      var imageUrl = YMaps.Styles.get(this.icon_style).iconStyle.href;
      var title    = this.title;
      var template = "<li><a href='#' class='category_link'><div><img src='${imageUrl}'/>${title}</div></a></li>"

      $.tmpl(template, { 'imageUrl': imageUrl, 'title': title }).appendTo(categorySelectorUl);
    })

    categorySelector.show();

    $('.category_link').click(function() {
      var filter = $(this).text();

      if (filter === 'Все') { drawMarkets(categories) } else { drawMarkets(categories, filter) }

      return false;
    })
  }

  function drawMarkets(categories, filter) {
    var yandexMapsStyle               = new YMaps.Style();
    var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();

    if (!(filter === undefined)) {
      categories = $.map(categories, function (category) {
        if (category.title === filter) { return category }
      })
    }

    yandexMaps.removeAllOverlays();

    $.each(categories, function(index) {
      yandexMapsStyle.iconStyle = YMaps.Styles.get(this.icon_style).iconStyle;
      var placemarkOptions      = { hideIcon: false, hasBalloon: false, style: yandexMapsStyle };

      $.each(this.markets, function(index, market) {
        var geoPoint  = new YMaps.GeoPoint(this.longitude, this.latitude);
        var placemark = new YMaps.Placemark(geoPoint, placemarkOptions);

        yandexMapsGeoCollectionBounds.add(geoPoint);

        yandexMaps.addOverlay(placemark);

        YMaps.Events.observe(placemark, placemark.Events.Click, function() {
          var marketInformation = $('#market_information');

          marketInformation.html($('#market_information_template').tmpl(market));
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

  $.getJSON('/', function(categories) {
    drawCategoriesLinks(categories);
    drawMarkets(categories);
  })

  $('#dialog_form').live('ajax:beforeSend', function() {
    if (validateEmail(userEmail)) {
      $.post($(this).attr('action'), $(this).serialize());
      setCookie(leftEmailCookie, true);
      disableDialog();
    } else {
      $('#dialog').vibrate({ frequency: 5000, spread: 5, duration: 600 });
      highlightEmail(userEmail);
    }

    return false;
  })

  $('.review_form').live('ajax:beforeSend', function() {
    if ($('#review_text').val()) {
      $.post($(this).attr('action'), $(this).serialize());
    }

    return false;
  })

  userEmail.placeholder();

  if (getCookie(leftEmailCookie)) { disableDialog() }
})

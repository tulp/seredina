$(document).ready(function() {
  var userEmail                 = $('#user_email');
  var marketInformation         = $('#market_information');
  var marketInformationTemplate = $('#market_information_template');

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
          marketInformation.html(marketInformationTemplate.tmpl(market));
          marketInformation.show();
        })
      })
    })

    yandexMaps.setBounds(yandexMapsGeoCollectionBounds);
  }

  function highlight(field) {
    if ((field.attr('placeholder') !== field.val()) && (field.val() !== '')) {
      field.css('color', 'red');
      setTimeout(function() { field.css('color', '') }, 600);
    }
  }

  $.getJSON('/', function(categories) {
    drawCategoriesLinks(categories);
    drawMarkets(categories);
  })

  $('#dialog_form').live('ajax:success', function(data, status, xhr) {
    if (status) {
      disableDialog();
    } else {
      $('#dialog').vibrate({ frequency: 5000, spread: 5, duration: 600 });
      highlight(userEmail);
    }
  })

  $('#sign_in_form').live('ajax:success', function(data, status, xhr) {
    if (status[0]) {
      disableDialog();
    } else {
      if (status[1]) {
        highlight($('#user_password'));
      } else {
        highlight($('#sign_in_user_email'));
      }
      $('#dialog').vibrate({ frequency: 5000, spread: 5, duration: 600 });
    }
  })

  $('#review_form').live('ajax:success', function(data, market, xhr) {
    if (market) {
      marketInformation.html(marketInformationTemplate.tmpl(market));
    }
  })

  userEmail.placeholder();
})

$(document).ready(function() {
  var userEmail                 = $('#user_email');
  // var marketInformation         = $('#market_information');
  // var marketInformationTemplate = $('#market_information_template');
  var review_form               = $('#review_form');
  var gift                      = $('.gift');
  var gift_form                 = $('#gift_form');

  function disableDialog() {
    $('#overlay').hide();
  }

  function rating(width, rating) {
    var spanWidth = width * rating;

    return "<span class='b-stars-full' style='width:" + spanWidth + "px;'></span>";
  }

  function yandexMapsIconStyle(market) {
    return YMaps.Styles.get(market.category.icon_style).iconStyle;
  }

  function drawDescription(market) {
    var descriptionTemplate = $('.b-sidebar-middle-description-template');

    $('.b-sidebar-middle-description').html(descriptionTemplate.tmpl(market, { imgSrc: yandexMapsIconStyle(market).href,
                                                                               rating: rating(16, market.rating) }));
  }

  function drawInfo(market) {
    var infoTemplate = $('.b-sidebar-middle-info-template');

    $('.b-sidebar-middle-info').html(infoTemplate.tmpl(market));
  }

  function drawReviews(market) {
    var reviewsTemplate = $('.b-sidebar-middle-reviews-template');

    $('.b-reviews').html(reviewsTemplate.tmpl(market));
  }

  function drawMarkets(markets) {
    var yandexMapsStyle               = new YMaps.Style();
    var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();
    var placemarkOptions              = { hideIcon: false, hasBalloon: false };

    yandexMaps.removeAllOverlays();

    $.each(markets, function(index, market) {
      var geoPoint, placemark;

      yandexMapsStyle.iconStyle = yandexMapsIconStyle(market);
      placemarkOptions['style'] = yandexMapsStyle;

      geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
      placemark = new YMaps.Placemark(geoPoint, placemarkOptions);

      yandexMapsGeoCollectionBounds.add(geoPoint);
      yandexMaps.addOverlay(placemark);

      YMaps.Events.observe(placemark, placemark.Events.Click, function() {
        drawDescription(market);
        drawInfo(market);
        drawReviews(market);
        $('.b-market').show();
      })
    })

    yandexMaps.setBounds(yandexMapsGeoCollectionBounds);
  }

  $.getJSON('/', function(markets) { drawMarkets(markets) });

  // function drawCategoriesLinks(categories) {
  //   var categorySelector   = $('#category_selector');
  //   var categorySelectorUl = categorySelector.find('ul');
  //
  //   $.each(categories, function(index) {
  //     var imageUrl = YMaps.Styles.get(this.icon_style).iconStyle.href;
  //     var title    = this.title;
  //     var template = "<li><a href='#' class='category_link'><div><img src='${imageUrl}'/>${title}</div></a></li>"
  //
  //     $.tmpl(template, { 'imageUrl': imageUrl, 'title': title }).appendTo(categorySelectorUl);
  //   })
  //
  //   categorySelector.show();
  //
  //   $('.category_link').click(function() {
  //     var filter = $(this).text();
  //
  //     if (filter === 'Все') { drawMarkets(categories) } else { drawMarkets(categories, filter) }
  //
  //     return false;
  //   })
  // }

  function highlight(field) {
    if ((field.attr('placeholder') !== field.val()) && (field.val() !== '')) {
      field.css('color', 'red');
      setTimeout(function() { field.css('color', '') }, 600);
    }
  }



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

  review_form.live('ajax:beforeSend', function(xhr, settings) {
    if (!$('#review_text').val()) { return false };
  })

  review_form.live('ajax:success', function(data, status, xhr) {
    if (status[0]) {
      var market = $.parseJSON(status[1]);
      marketInformation.html(marketInformationTemplate.tmpl(market));
      if (status[2]) { gift.show() }
    }
  })

  gift_form.live('ajax:beforeSend', function(xhr, settings) {
    var recipient = $('#gift_recipient').val();
    var regexp    = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!regexp.test(recipient)) { return false };
  })

  gift_form.live('ajax:success', function(data, status, xhr) {
    if (status) { gift.hide() }
  })

  function toggleTab(tab) {
    $('.b-tabs-active').attr('class', 'b-tabs-inactive');
    tab.attr('class', 'b-tabs-active');

    $('.b-sidebar-middle-description').nextAll(':visible').hide();
    switch(tab.attr('id')) {
      case 'info_tab':
        $('.b-sidebar-middle-info').show();
        break;
      case 'reviews_tab':
        $('.b-sidebar-middle-reviews').show();
        break;
      case 'add_review_tab':
        $('.b-sidebar-middle-add_review').show();
        break;
    }
  }

  $('.b-tabs a').click(function() {
    toggleTab($(this));

    return false;
  })

  $('#add_review').click(function() {
    toggleTab($('#add_review_tab'));

    return false;
  })

  userEmail.placeholder();
})

// drawCategoriesLinks(categories);
// if (!(filter === undefined)) {
//   categories = $.map(categories, function (category) {
//     if (category.title === filter) { return category }
//   })
// }

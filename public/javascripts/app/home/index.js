$(document).ready(function() {
  var markets, users, categories;

  var signUpForm      = $('#sign_up_form');
  var signUpUserEmail = $('#sign_up_user_email');


    $('.b-sidebar-middle-info').html(infoTemplate.tmpl(market));
	$('.b-sidebar-middle').css('max-height', $('body').height() - 100);
	$('.b-sidebar-middle-info').css('height', $('body').height() - 380);
  }

  var reviewForm = $('#review_form');
  var reviewText = $('#review_text');



  // var gift                      = $('.gift');
  // var gift_form                 = $('#gift_form');

  // markets
  function drawMarkets(markets) {
    var yandexMapsStyle               = new YMaps.Style();
    var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();
    var placemarkOptions              = { hideIcon: false, hasBalloon: false };

    yandexMaps.removeAllOverlays();

    $.each(markets, function(index, market) {
      var geoPoint, placemark;

      yandexMapsStyle.iconStyle        = new YMaps.IconStyle();
      yandexMapsStyle.iconStyle.href   = market.category.icon_image;
      yandexMapsStyle.iconStyle.size   = new YMaps.Point(27, 26);
      yandexMapsStyle.iconStyle.offset = new YMaps.Point(-10, -25);

      placemarkOptions['style'] = yandexMapsStyle;

      geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
      placemark = new YMaps.Placemark(geoPoint, placemarkOptions);

      yandexMapsGeoCollectionBounds.add(geoPoint);
      yandexMaps.addOverlay(placemark);

      YMaps.Events.observe(placemark, placemark.Events.Click, function() {
        drawDescription(market);
        drawInfo(market);
        drawReviews(market);
        fillReviewForm(market);
        $('.b-market').show();
      })
    })

    yandexMaps.setBounds(yandexMapsGeoCollectionBounds);
  }

  function drawDescription(market) {
    var descriptionTemplate = $('.b-sidebar-middle-description-template');

    $('.b-sidebar-middle-description').html(descriptionTemplate.tmpl(market, { rating: drawRating(market) }));
  }

  function drawRating(object) {
    var spanWidth = 16 * object.rating;

    return "<span class='b-stars-full' style='width:" + spanWidth + "px;'></span>";
  }

  function drawInfo(market) {
    var infoTemplate = $('.b-sidebar-middle-info-template');

    $('.b-sidebar-middle-info').html(infoTemplate.tmpl(market));
  }

  function drawReviews(market) {
    var reviewsTemplate = $('.b-sidebar-middle-reviews-template');

    $.each(market.reviews, function(index, review) { review.rating = drawRating(review) });

    $('.b-reviews').html(reviewsTemplate.tmpl(market));
  }

  function fillReviewForm(market) { $('#review_market_id').val(market.id) };

  $.getJSON(jsonMarketsPath, function(collection) {
    markets = collection;
    drawMarkets(markets);
  });
  // ====================

  // sign up and sign in forms
  function disableDialog() { $('#overlay').hide() };

  function vibrateDialog() { $('#dialog').vibrate({ frequency: 5000, spread: 5, duration: 600 }) };

  function highlightField(field) {
    if ((field.attr('placeholder') !== field.val()) && (field.val() !== '')) {
      field.css('color', 'red');
      setTimeout(function() { field.css('color', '') }, 600);
    }
  }

  // sign up form
  signUpForm.live('ajax:beforeSend', function(xhr, settings) {
    var emailRegexp  = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    var invalidEmail = false;
    var user;

    if (emailRegexp.test(signUpUserEmail.val())) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === signUpUserEmail.val()) {
          user = users[i];
          break;
        }
      }
      if (user) {
        if (user['confirmed?']) {
          $('.sign_up_form').hide();
          $('.sign_in_form').show();
          $('#sign_in_user_email').val(signUpUserEmail.val());

          return false;
        } else {
          invalidEmail = true;
        }
      }
    } else {
      invalidEmail = true;
    }

    if (invalidEmail) {
      vibrateDialog();
      highlightField(signUpUserEmail);

      return false;
    }
  })

  signUpForm.live('ajax:success', function(data, status, xhr) {
    if (status) {
      disableDialog();
    } else {
      vibrateDialog();
      highlightField(signUpUserEmail);
    }
  })

  signUpUserEmail.placeholder();

  // sign in form
  $('#sign_in_form').live('ajax:success', function(data, status, xhr) {
    if (status) {
      disableDialog();
    } else {
      vibrateDialog();
      highlightField($('#user_password'));
    }
  })

  $.getJSON(jsonUsersPath, function(collection) { users = collection });
  // ====================

  // categories
  $.getJSON(jsonCategoriesPath, function(collection) {
    var activeCategory, inactiveCategories, indexLastElement;

    categories         = collection;
    indexLastElement   = categories.length - 1
    activeCategory     = categories[indexLastElement];
    inactiveCategories = categories.slice(0, indexLastElement);

    drawCategories(activeCategory, inactiveCategories);
  })

  function drawCategories(activeCategory, inactiveCategories) {
    var activeItem, inactiveItems;
    var categoriesTemplate = $('.b-categories-template');

    $('.b-categories').html(categoriesTemplate.tmpl({ activeCategory: activeCategory, inactiveCategories: inactiveCategories }));

    activeItem    = $('.b-categories ul li:first');
    inactiveItems = $('.b-categories ul li:not(:first)');

    activeItem.click(function() { inactiveItems.toggle() });
    inactiveItems.click(function() {
      var filteredMarkets, selectedCategory, filteredCategories = [];
      var categoryTitle = $(this).find('span').text();

      if (categoryTitle === 'Все категории') {
        filteredMarkets = markets;
      } else {
        filteredMarkets = $.grep(markets, function(market) { return (market.category.title === categoryTitle) });
      }

      for (var i = 0; i < categories.length; i++) {
        if (categories[i].title === categoryTitle) {
          selectedCategory = categories[i];
        } else {
          filteredCategories.push(categories[i]);
        }
      }

      drawMarkets(filteredMarkets);
      drawCategories(selectedCategory, filteredCategories);
    })
  }
  // ====================

  $('#review_form_submit_button').click(function() {
    if (reviewText.val()) { reviewForm.submit() }

    return false;
  })

  reviewForm.live('ajax:success', function(data, status, xhr) {
    if (status[0]) {
      var market = $.parseJSON(status[1]);

      drawDescription(market);
      drawReviews(market);
      toggleTab($('#reviews_tab'));
      reviewText.val('');
    }
  })

  // if (status[2]) { gift.show() }

  // gift_form.live('ajax:beforeSend', function(xhr, settings) {
  //    var recipient = $('#gift_recipient').val();
  //    var regexp    = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //
  //    if (!regexp.test(recipient)) { return false };
  //  })
  //
  //  gift_form.live('ajax:success', function(data, status, xhr) {
  //    if (status) { gift.hide() }
  //  })

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
})

$(document).ready(function() {
  var markets, users, categories, current_user;
  var oldMarket, oldPlacemark;

  var notificationLabel = $('.b-notification-label');

  var formDiscount = $('.b-form_discount');
  var giftForm = $('#gift_form');
  var recipientEmail = $('#recipient_email');

  var middleInfo = $('.b-sidebar-middle-info');

  var reviewForm = $('#review_form');
  var reviewText = $('#review_text');
  
  var emailRegexp    = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  function highlightField(field) {
    if ((field.attr('placeholder') !== field.val()) && (field.val() !== '')) {
      field.css('color', 'red');
      setTimeout(function() { field.css('color', '') }, 600);
    }
  };

  function cl(a){
    console.log(a);
  } 

  function selectedPlacemark(market) {
    var selectedSize = new YMaps.Style();
    selectedSize.iconStyle = new YMaps.IconStyle();
    selectedSize.iconStyle.size = new YMaps.Point(54, 52);
    selectedSize.iconStyle.href = '/images/current.png';
    selectedSize.iconStyle.offset = new YMaps.Point(-19, -48);
    return selectedSize;
  }

  function drawCategories(activeCategory, inactiveCategories) {
    var activeItem, inactiveItems;
    var categoriesTemplate = $('.b-categories-template');

    $('.b-categories').html(categoriesTemplate.tmpl({ activeCategory: activeCategory, inactiveCategories: inactiveCategories }));

    activeItem = $('.b-categories ul li:first');
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
    
    
    // markets
    function drawMarkets(markets) {
      var yandexMapsStyle = new YMaps.Style();
      var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();
      // var placemarkOptions = { hideIcon: false, hasBalloon: false };
    
      yandexMaps.removeAllOverlays();
         // console.log(markets);
      $.each(markets, function(index, market) {
        var geoPoint, placemark;
    
        geoPoint = new YMaps.GeoPoint(market.longitude, market.latitude);
        placemark = new YMaps.Placemark(geoPoint, {style: market.category.icon_style, hideIcon: false, hasBalloon: false});
    
        yandexMapsGeoCollectionBounds.add(geoPoint);
        yandexMaps.addOverlay(placemark);
    
        
        YMaps.Events.observe(placemark, placemark.Events.Click, function() {
             var pOptions = {};

             $('.b-categories ul li:not(:first)').hide();

             placemark.setOptions({style: selectedPlacemark(market), zIndex: YMaps.ZIndex.OVERLAY_ACTIVE});
             if((oldPlacemark) && (oldPlacemark !== placemark)){
               oldPlacemark.setOptions({style: oldMarket.category.icon_style, hideIcon: false, hasBalloon: false, zIndex: YMaps.ZIndex.OVERLAY});
             }
    
          drawDescription(market);
          drawInfo(market);
          toggleTab($('.b-tabs a').first());
          // drawReviews(market);
          fillReviewForm(market);
    
          reviewText.val('');

          $('.b-market').show();
             oldMarket = market;
             oldPlacemark = placemark;
        })
      })
    
      // yandexMaps.setBounds(yandexMapsGeoCollectionBounds);
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
      
      middleInfo.html(infoTemplate.tmpl(market));
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

    // categories
    $.getJSON(jsonCategoriesPath, function(collection) {
      var activeCategory, inactiveCategories, indexLastElement;

      categories = collection;
      indexLastElement = categories.length - 1
      activeCategory = categories[indexLastElement];
      inactiveCategories = categories.slice(0, indexLastElement);

      drawCategories(activeCategory, inactiveCategories);
    })

    function drawCategories(activeCategory, inactiveCategories) {
      var activeItem, inactiveItems;
      var categoriesTemplate = $('.b-categories-template');

      $('.b-categories').html(categoriesTemplate.tmpl({ activeCategory: activeCategory, inactiveCategories: inactiveCategories }));

      activeItem = $('.b-categories ul li:first');
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

    // gifts
    function checkCurrentUserGifts() { if (current_user && current_user['can_give_gifts?']) { notificationLabel.show() } };

    function vibrateDiscount() { $('.b-form_discount_wrap').vibrate({ frequency: 5000, spread: 5, duration: 600 }) };

    notificationLabel.click(function() { formDiscount.show() });

    giftForm.live('ajax:beforeSend', function(xhr, settings) {
      if (!emailRegexp.test(recipientEmail.val())) {
        vibrateDiscount();
        highlightField(recipientEmail);

        return false;
      }
    })

    giftForm.live('ajax:success', function(data, status, xhr) {
      if (status[0]) {
        formDiscount.hide();
        if (!status[1]) { notificationLabel.hide() };
      } else {
        vibrateDiscount();
        highlightField(recipientEmail);
      }
    })

    formDiscount.find('.b-form_discount_top a').click(function() {
      giftForm.find('input').not(':hidden, :image').val('');
      formDiscount.hide();

      return false;
    })

    recipientEmail.placeholder();

    $.getJSON(jsonCurrentUserPath, function(response) {
      current_user = response;
      checkCurrentUserGifts();
    })
    // ====================

    var reviewForm = $('#review_form');
    var reviewText = $('#review_text');

    $('#review_form_submit_button').click(function() {
      if ($.trim(reviewText.val())) { reviewForm.submit() }

      return false;
    })

    reviewForm.live('ajax:success', function(data, status, xhr) {
      if (status[0]) {
        var market;

        market = $.parseJSON(status[3]);
        drawDescription(market);
        // drawReviews(market);
        toggleTab($('#reviews_tab'));
        reviewText.val('');

        if (status[1]) { notificationLabel.show() };

        if (status[2]) {
          formDiscount.show();
        } else {
          $('.b-notifications-yellow').fadeIn('slow').delay(3000).fadeOut('slow');
        };
      }
    })

    function toggleTab(tab) {
      $('.b-tabs-active').attr('class', 'b-tabs-inactive');
      tab.attr('class', 'b-tabs-active');
      // $('.b-sidebar-middle-content').css('max-height', $('body').height() - 100);

      $('.b-sidebar-middle-content').children(':visible').hide();
      switch(tab.attr('id')) {
        case 'info_tab':
          $('.b-sidebar-middle-info').show();
          break;
        case 'reviews_tab':
          $.getJSON(jsonMarketsPath + '/' + $('#market_id').val(), function(market) {
            drawReviews(market);
            $('.b-sidebar-middle-reviews').show();
          });

          break;
        case 'add_review_tab':
          $('.b-sidebar-middle-add_review').show();
          break;
      }

      var descHeight = $('.b-sidebar-middle-description').height();
      $('.b-sidebar-middle-content').css('max-height', $('body').height() - 245 - descHeight);
      // $('.b-sidebar-middle-content').jScrollPane();      
    }

    $('.b-tabs a').click(function() {
      toggleTab($(this));

      return false;
    })

    $('#add_review').click(function() {
      toggleTab($('#add_review_tab'));

      return false;
    })

    YMaps.Events.observe(yandexMaps, yandexMaps.Events.Click, function() {
      $('.b-categories ul li:not(:first)').hide();
    });

    // notification

    $('.b-notifications-yellow a').click(function() {
      $('.b-notifications-yellow').stop().fadeOut('slow');

      return false;
    });
})

$(document).ready(function() {
	function redirect(path){
		window.location = "#/"+path; app.runRoute('get','#/'+path);
	}

	function render(path){
		app.runRoute('get','#/'+path);
	}

  function cl(a){
    console.log(a);
  }

  var middleInfo        = $('.b-sidebar-middle-info');
  var middleDescription = $('.b-sidebar-middle-description');

 var app = $.sammy('#main', function() {
		this.get('#/:category', function(context) {
      var category = this.params['category'];

			// отрендерить выбиралку категорий - развернутое состояние,

			// снять выделение со всех категорий
			$('.b-categories li').removeClass('active');
			// выделить текущую категорию
			$('.b-categories li.' + category).toggleClass('active');

			// отрендерить маркеты этой категории
			$.get('/j/markets?category='+category, function(data){
				drawMarkets(data);
			}, 'json');

      $('.b-categories li').unbind('click');
      $('.b-categories li').one('click',handler1);

    });

		this.get('#/:category/:id', function(context) {
		  var category = this.params['category'];
			var id = this.params['id'];
			render(category);
			$.get('/j/markets?id='+id, function(market){
				console.log(market);

				// отрендерить инфу о заведении
  			drawDescription(market);
  			drawInfo(market);
  			drawReviews(market);
  			fillReviewForm(market);

  			$('.b-market').show();
			})


			// переключить выбиралку категорий в свернутое состояние
			$('.b-categories ul li:not(.active)').hide();

      $('.b-categories li').unbind('click', handler1);
			$('.b-categories ul li.active').one('click',handler2);

			// выделить текущий маркет на карте
    });

		this.get('#/:category/:id/reviews', function(context) {
      console.log('reviews of market');
			// показать отзывы

    });

		this.get('#/:category/:id/add_review', function(context) {
      console.log('add review to market');
			// показать форму добавления отзыва

    });
 });

  $(function() {

    app.run('#/all');
  });


  // var markets, users, categories, current_user;
	var oldMarket, oldPlacemark;
	//
	//   var emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	//
	//   var signUpForm      = $('#sign_up_form');
	//   var signUpUserEmail = $('#sign_up_user_email');
	// 
	  var notificationLabel = $('.b-notification-label');
	
	  var formDiscount   = $('.b-form_discount');
	  var giftForm       = $('#gift_form');
	  var recipientEmail = $('#recipient_email');
	//
	  var middleInfo = $('.b-sidebar-middle-info');
	//
	//
	//
	  var reviewForm = $('#review_form');
	  var reviewText = $('#review_text');
	//
	function selectedPlacemark(market) {
		var selectedSize = new YMaps.Style();
	  selectedSize.iconStyle        = new YMaps.IconStyle();
	  selectedSize.iconStyle.size   = new YMaps.Point(54, 52);
	  selectedSize.iconStyle.href   = '/images/current.png';
	  selectedSize.iconStyle.offset = new YMaps.Point(-19, -48);
		return selectedSize;
	}
	//
	//   // markets
	  function drawMarkets(markets) {
	    var yandexMapsStyle               = new YMaps.Style();
	    var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();
	    // var placemarkOptions              = { hideIcon: false, hasBalloon: false };

	    yandexMaps.removeAllOverlays();
		// console.log(markets);

    $.each(markets, function(index, market) {
      var geoPoint, placemark;

      geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
      placemark = new YMaps.Placemark(geoPoint, {style: market.category.icon_style, hideIcon: false, hasBalloon: false, zIndexActive: 800 });

      yandexMapsGeoCollectionBounds.add(geoPoint);
      yandexMaps.addOverlay(placemark);

      YMaps.Events.observe(placemark, placemark.Events.Click, function() {
				var pOptions = {};
				placemark.setOptions({style: selectedPlacemark(market)});
				if(oldPlacemark){
					oldPlacemark.setOptions({style: oldMarket.category.icon_style, hideIcon: false, hasBalloon: false, zIndexActive: 100});
				}
				
        drawDescription(market);
        drawInfo(market);
        drawReviews(market);
        fillReviewForm(market);

        $('.b-market').show();
				oldMarket = market;
				oldPlacemark = placemark;

      })
    })

    yandexMaps.setBounds(yandexMapsGeoCollectionBounds);
  }

  function drawDescription(market) {
    var descriptionTemplate = $('.b-sidebar-middle-description-template');

    middleDescription.html(descriptionTemplate.tmpl(market, { rating: drawRating(market) }));
  }

  function drawRating(object) {
    var spanWidth = 16 * object.rating;

    return "<span class='b-stars-full' style='width:" + spanWidth + "px;'></span>";
  }

  function drawInfo(market) {
    var infoTemplate = $('.b-sidebar-middle-info-template');

  	// $('.b-sidebar-middle').css('max-height', $('body').height() - 100);
  	// middleInfo.css('height', $('body').height() - 380);

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
  // ====================

  // sign up and sign in forms
  // function showSignInForm() {
  //   $('.sign_up_form').hide();
  //   $('.sign_in_form').show();
  //   $('#sign_in_user_email').val(signUpUserEmail.val());
  // }
  //
  // function vibrateDialog() { $('#dialog').vibrate({ frequency: 5000, spread: 5, duration: 600 }) };
  //
  // function highlightField(field) {
  //   if ((field.attr('placeholder') !== field.val()) && (field.val() !== '')) {
  //     field.css('color', 'red');
  //     setTimeout(function() { field.css('color', '') }, 600);
  //   }
  // }
  //
  // // sign up form
  // signUpForm.live('ajax:beforeSend', function(xhr, settings) {
  //   if (emailRegexp.test(signUpUserEmail.val())) {
  //     for (var i = 0; i < users.length; i++) {
  //       if (users[i].email === signUpUserEmail.val()) {
  //         current_user = users[i];
  //         break;
  //       }
  //     }
  //     showSignInForm();
  //     if (current_user) { return false };
  //   } else {
  //     vibrateDialog();
  //     highlightField(signUpUserEmail);
  //
  //     return false;
  //   }
  // })
  //
  // signUpUserEmail.placeholder();
  //
  // // sign in form
  // $('#sign_in_form').live('ajax:success', function(data, status, xhr) {
  //   if (status) {
  //     $('#overlay').hide();
  //     checkCurrentUserGifts();
  //   } else {
  //     vibrateDialog();
  //     highlightField($('#user_password'));
  //   }
  // })
  //
  // $.getJSON(jsonUsersPath, function(collection) { users = collection });
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

  // gifts
  function checkCurrentUserGifts() { if (current_user && current_user['can_give_gifts?']) { notificationLabel.show() } };

  function vibrateDiscount() { $('.b-form_discount_wrap').vibrate({ frequency: 5000, spread: 5, duration: 600 }) };

  function resetGiftForm() { giftForm.find('input').not(':hidden, :image').val('') };

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
      resetGiftForm();
      formDiscount.hide();
      if (!status[1]) { notificationLabel.hide() };
    } else {
      vibrateDiscount();
      highlightField(recipientEmail);
    }
  })

  formDiscount.find('.b-form_discount_top a').click(function() {
    resetGiftForm();
    formDiscount.hide();

    return false;
  })

  recipientEmail.placeholder();

  $.getJSON(jsonCurrentUserPath, function(response) {
    current_user = response;
    checkCurrentUserGifts();
  })
  // ====================

  // add review
  $('#add_review').click(function() {
    toggleTab($('#add_review_tab'));

    return false;
  })

  $('#review_form_submit_button').click(function() {
    if (reviewText.val().trim()) { reviewForm.submit() }

    return false;
  })

  reviewForm.live('ajax:success', function(data, status, xhr) {
    if (status[0]) {
      var market;

      if (status[1]) { notificationLabel.show() };

      market = $.parseJSON(status[2]);
      drawDescription(market);
      drawReviews(market);
      toggleTab($('#reviews_tab'));
      reviewText.val('');
    }
  })
  // ====================

  // tabs
  function toggleTab(tab) {
    $('.b-tabs-active').attr('class', 'b-tabs-inactive');
    tab.attr('class', 'b-tabs-active');

    middleDescription.nextAll(':visible').hide();
    switch(tab.attr('id')) {
      case 'info_tab':
        middleInfo.show();
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
  // ====================
})

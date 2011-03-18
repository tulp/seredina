$(document).ready(function() {
    function redirect(path){
      window.location = "#/"+path//; app.runRoute('get','#/'+path); 
    }
  // 
  function render(path){
   app.runRoute('get','#/'+path); 
  }

  function cl(a){
    console.log(a);
  }



	// $('.b-categories ul li:not(.active)').hide();
	
 var app = $.sammy('.b-sidebar', function() {

   //Around
   this.around(function(callback) {
     var context = this;
     this.load('/j/markets?category=all')
         .then(function(items){
           context.items = items;
         })
         .then(callback);
   });
   
   var handler1 = function() {
     redirect($(this).attr('class').split(' ')[0]);
   };

   var handler2 = function() {
     $('.b-categories ul li:not(.active)').show();
     $('.b-categories li').unbind('click', handler2);
 		$('.b-categories li').one('click',handler1);
   };
   
   function showCategories(category){
    $('.b-categories li').removeClass('active');
    $('.b-categories li.' + category).toggleClass('active');
     
    $('.b-categories li').unbind('click');
    $('.b-categories li').one('click',handler1);
  }
   
   function collapseCategories(){
     $('.b-categories ul li:not(.active)').hide();
     $('.b-categories li').unbind('click', handler1);
		 $('.b-categories ul li.active').one('click',handler2);
   }
   
    //Category
		this.get('#/:category', function(context) {
      var category = this.params['category'];
      showCategories(category);
			
			// отрендерить маркеты этой категории
			$.get('/j/markets?category='+category, function(markets){
  	    var yandexMapsStyle               = new YMaps.Style();
  	    var yandexMapsGeoCollectionBounds = new YMaps.GeoCollectionBounds();

  	    yandexMaps.removeAllOverlays();
  	    $.each(markets, function(index, market) {
  	      var geoPoint, placemark;

  	      geoPoint  = new YMaps.GeoPoint(market.longitude, market.latitude);
  	      placemark = new YMaps.Placemark(geoPoint, {style: market.category.icon_style, hideIcon: false, hasBalloon: false, zIndexActive: 800 });

  	      yandexMapsGeoCollectionBounds.add(geoPoint);
  	      yandexMaps.addOverlay(placemark);

  	      YMaps.Events.observe(placemark, placemark.Events.Click, function() {
  					context.redirect("#", market.category.icon_image, market.id);
            placemark.setOptions({style: selectedPlacemark(market)});

            if(oldPlacemark){
             oldPlacemark.setOptions({style: oldMarket.category.icon_style, hideIcon: false, hasBalloon: false, zIndexActive: 100});
            }
            
            oldMarket = market;
            oldPlacemark = placemark;
  	      })
  	    })

			}, 'json');
			

    });

		this.get('#/:category/:id', function(context) {
      var category = this.params['category'];
      showCategories(category);

			var id = this.params['id'];
      // render(category);
			$.get('/j/markets?id='+id, function(market){
  			drawDescription(market);
  			drawInfo(market);
        // drawReviews(market);
        // fillReviewForm(market);

  			$('.b-market').show();
			})
      

			// переключить выбиралку категорий в свернутое состояние
			
      collapseCategories();
			
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
	// 
	  function drawDescription(market) {
	    var descriptionTemplate = $('.b-sidebar-middle-description-template');
	
	    $('.b-sidebar-middle-description').html(descriptionTemplate.tmpl(market, { rating: drawRating(market) }));
	  }
	// 
	  function drawRating(object) {
	    var spanWidth = 16 * object.rating;
	
	    return "<span class='b-stars-full' style='width:" + spanWidth + "px;'></span>";
	  }
	// 
	  function drawInfo(market) {
	    var infoTemplate = $('.b-sidebar-middle-info-template');
	
	  	// $('.b-sidebar-middle').css('max-height', $('body').height() - 100);
	  	// middleInfo.css('height', $('body').height() - 380);
	
	    middleInfo.html(infoTemplate.tmpl(market));
	  }
	// 
	  function drawReviews(market) {
	    var reviewsTemplate = $('.b-sidebar-middle-reviews-template');
	
	    $.each(market.reviews, function(index, review) { review.rating = drawRating(review) });
	
	    $('.b-reviews').html(reviewsTemplate.tmpl(market));
	  }
	// 
	  function fillReviewForm(market) { $('#review_market_id').val(market.id) };
	// 
	//   $.getJSON(jsonMarketsPath, function(collection) {
	//     markets = collection;
	//     drawMarkets(markets);
	//   });
	//   // ====================
	// 
	//   // categories
	//   $.getJSON(jsonCategoriesPath, function(collection) {
	//     var activeCategory, inactiveCategories, indexLastElement;
	// 
	//     categories         = collection;
	//     indexLastElement   = categories.length - 1
	//     activeCategory     = categories[indexLastElement];
	//     inactiveCategories = categories.slice(0, indexLastElement);
	// 
	//     drawCategories(activeCategory, inactiveCategories);
	// 	// $('.b-categories ul li:not(:first)').toggle();
	//   })
	// 
	//   function drawCategories(activeCategory, inactiveCategories) {
	//     var activeItem, inactiveItems;
	//     var categoriesTemplate = $('.b-categories-template');
	// 
	//     $('.b-categories').html(categoriesTemplate.tmpl({ activeCategory: activeCategory, inactiveCategories: inactiveCategories }));
	// 
	//     activeItem    = $('.b-categories ul li:first');
	//     inactiveItems = $('.b-categories ul li:not(:first)');
	// 
	//     activeItem.click(function() { inactiveItems.toggle() });
	//     inactiveItems.click(function() {
	//       var filteredMarkets, selectedCategory, filteredCategories = [];
	//       var categoryTitle = $(this).find('span').text();
	// 
	//       if (categoryTitle === 'Все категории') {
	//         filteredMarkets = markets;
	//       } else {
	//         filteredMarkets = $.grep(markets, function(market) { return (market.category.title === categoryTitle) });
	//       }
	// 
	//       for (var i = 0; i < categories.length; i++) {
	//         if (categories[i].title === categoryTitle) {
	//           selectedCategory = categories[i];
	//         } else {
	//           filteredCategories.push(categories[i]);
	//         }
	//       }
	// 
	//       drawMarkets(filteredMarkets);
	//       drawCategories(selectedCategory, filteredCategories);
	//     })
	//   }
	//   // ====================
	// 
	//   // gifts
	//   function checkCurrentUserGifts() { if (current_user && current_user['can_give_gifts?']) { notificationLabel.show() } };
	// 
	//   function vibrateDiscount() { $('.b-form_discount_wrap').vibrate({ frequency: 5000, spread: 5, duration: 600 }) };
	// 
	//   notificationLabel.click(function() { formDiscount.show() });
	// 
	//   giftForm.live('ajax:beforeSend', function(xhr, settings) {
	//     if (!emailRegexp.test(recipientEmail.val())) {
	//       vibrateDiscount();
	//       highlightField(recipientEmail);
	// 
	//       return false;
	//     }
	//   })
	// 
	//   giftForm.live('ajax:success', function(data, status, xhr) {
	//     if (status[0]) {
	//       formDiscount.hide();
	//       if (!status[1]) { notificationLabel.hide() };
	//     } else {
	//       vibrateDiscount();
	//       highlightField(recipientEmail);
	//     }
	//   })
	// 
	//   formDiscount.find('.b-form_discount_top a').click(function() {
	//     giftForm.find('input').not(':hidden, :image').val('');
	//     formDiscount.hide();
	// 
	//     return false;
	//   })
	// 
	//   recipientEmail.placeholder();
	// 
	//   $.getJSON(jsonCurrentUserPath, function(response) {
	//     current_user = response;
	//     checkCurrentUserGifts();
	//   })
	//   // ====================
	// 
	// 
	// 
	//   var reviewForm = $('#review_form');
	//   var reviewText = $('#review_text');
	// 
	//   $('#review_form_submit_button').click(function() {
	//     if (reviewText.val()) { reviewForm.submit() }
	// 
	//     return false;
	//   })
	// 
	//   reviewForm.live('ajax:success', function(data, status, xhr) {
	//     if (status[0]) {
	//       var market = $.parseJSON(status[1]);
	// 
	//       drawDescription(market);
	//       drawReviews(market);
	//       toggleTab($('#reviews_tab'));
	//       reviewText.val('');
	//     }
	//   })
	// 
	//   function toggleTab(tab) {
	//     $('.b-tabs-active').attr('class', 'b-tabs-inactive');
	//     tab.attr('class', 'b-tabs-active');
	// 
	//     $('.b-sidebar-middle-description').nextAll(':visible').hide();
	//     switch(tab.attr('id')) {
	//       case 'info_tab':
	//         middleInfo.show();
	//         break;
	//       case 'reviews_tab':
	//         $('.b-sidebar-middle-reviews').show();
	//         break;
	//       case 'add_review_tab':
	//         $('.b-sidebar-middle-add_review').show();
	//         break;
	//     }
	//   }
	// 
	//   $('.b-tabs a').click(function() {
	//     toggleTab($(this));
	// 
	//     return false;
	//   })
	// 
	//   $('#add_review').click(function() {
	//     toggleTab($('#add_review_tab'));
	// 
	//     return false;
	//   })
})
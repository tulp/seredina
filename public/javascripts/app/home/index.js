j(document).ready(function() {
  var leftEmailCookie = 'left_email';

  function disableDialog() {
    j('#dialog_overlay, #dialog').hide();
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

        placemark.title    = this.title;
        placemark.discount = this.discount;
        placemark.time     = this.time;
        placemark.phone    = this.phone;
        placemark.website  = this.website;
        placemark.email    = this.email;

        yandexMaps.addOverlay(placemark);
      })
    })
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
      var class_name = 'invalid';

      email.addClass(class_name);
      setTimeout(function() { email.removeClass(class_name) }, 1200);
    }

    return false;
  })

  if (getCookie(leftEmailCookie)) { disableDialog() }
})
namespace :parser do
  desc 'Parse markets'
  task :markets => :environment do
    geocoder_url       = "http://geocode-maps.yandex.ru/1.x/?key=#{YANDEX_MAPS_API_KEY}&results=1&geocode="
    filename           = 'assets/data.csv'
    yandex_icon_styles = { 'Авто'                      => 'default#carIcon',
                           'Медицина'                  => 'default#hospitalIcon',
                           'Одежда'                    => 'default#tailorShopIcon',
                           'Подарки'                   => 'default#gymIcon',
                           'Продукты питания'          => 'default#restaurauntIcon',
                           'Спорт, отдых, развлечения' => 'default#stadiumIcon',
                           'Строительство, ремонт'     => 'default#workshopIcon',
                           'Техника'                   => 'default#dryCleanerIcon',
                           'Товары для дома и офиса'   => 'default#houseIcon',
                           'Услуги'                    => 'default#barberShopIcon' }

    FasterCSV.foreach(filename) do |market|
      category_title   = market[1]
      category         = Category.find_or_create_by_title(category_title, :icon_style => yandex_icon_styles[category_title])

      address = market[14]

      if phones = market[15]
        phones = phones.split(',')
      end

      if website = market[17]
        protocol = 'http://'
        website  = "#{protocol}#{website}" unless website.include? protocol
      end

      if emails = market[18]
        emails = emails.split(', ')
      end

      query            = URI.encode([market[0], address].join('+'))
      geocoder         = HTTParty.get(geocoder_url + query)
      coordinates      = geocoder['ymaps']['GeoObjectCollection']['featureMember']['GeoObject']['Point']['pos'].split

      Market.create({ :category_id => category.id,
                      :title       => market[4],
                      :classic     => market[7],
                      :vip         => market[10],
                      :address     => address,
                      :phones      => phones,
                      :time        => market[16],
                      :website     => website,
                      :emails      => emails,
                      :description => market[19],
                      :longitude   => coordinates.first,
                      :latitude    => coordinates.last })
      print '.'
    end
    puts
  end
end
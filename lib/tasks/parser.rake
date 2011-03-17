namespace :parser do
  desc 'Parse markets'
  task :markets => :environment do
    Category.delete_all
    Market.delete_all

    [Category, Market].each do |model|
      if Rails.env.production?
        ActiveRecord::Base.connection.reset_pk_sequence!(model.table_name)
      else
        ActiveRecord::Base.connection.execute("ALTER TABLE #{model.table_name} AUTO_INCREMENT = 1")
      end
    end

    geocoder_url = "http://geocode-maps.yandex.ru/1.x/?key=#{YANDEX_MAPS_API_KEY}&results=1&geocode="
    filename     = 'assets/data.csv'
    icon_images  = { 'Авто'                      => '/images/categories/car.png',
                     'Медицина'                  => '/images/categories/hospital.png',
                     'Одежда'                    => '/images/categories/tailorShop.png',
                     'Подарки'                   => '/images/categories/gym.png',
                     'Продукты питания'          => '/images/categories/restauraunt.png',
                     'Спорт, отдых, развлечения' => '/images/categories/stadium.png',
                     'Строительство, ремонт'     => '/images/categories/workshop.png',
                     'Техника'                   => '/images/categories/dryCleaner.png',
                     'Товары для дома и офиса'   => '/images/categories/house.png',
                     'Услуги'                    => '/images/categories/barberShop.png' }
                     
    icon_styles = { 'Авто'                      => 'default#carIcon',
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
      category_title = market[1]
      category       = Category.find_or_create_by_title(category_title, :icon_image => icon_images[category_title], :icon_style => icon_styles[category_title])

      subcategory = market[2].strip

      address = market[14]

      if phones = market[15]
        phones = phones.gsub('(383)', '')
        phones = phones.split(',')
        phones.map! { |phone| phone.strip }
      end

      if time = market[16]
        time.strip.gsub(/\.$/, '')
      end

      if websites = market[17]
        websites = websites.gsub('http://', '')
        websites = websites.split(',')
        websites.map! { |website| website.strip }
      end

      if emails = market[18]
        emails = emails.split(',')
        emails.map! { |email| email.strip }
      end

      query            = URI.encode([market[0], address].join('+'))
      geocoder         = HTTParty.get(geocoder_url + query)
      coordinates      = geocoder['ymaps']['GeoObjectCollection']['featureMember']['GeoObject']['Point']['pos'].split

      Market.create({ :category_id => category.id,
                      :subcategory => subcategory,
                      :title       => market[4],
                      :classic     => market[7],
                      :vip         => market[10],
                      :address     => address,
                      :phones      => phones,
                      :time        => time,
                      :websites    => websites,
                      :emails      => emails,
                      :description => market[19],
                      :longitude   => coordinates.first,
                      :latitude    => coordinates.last })

      print '.'
    end

    Category.create(:title => 'Все категории', :icon_image => '/images/categories/infinity.png')

    puts
  end
end
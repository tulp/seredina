namespace :parser do
  desc 'Parse markets'
  task :markets => :environment do
    geocoder_url = "http://geocode-maps.yandex.ru/1.x/?key=#{YANDEX_MAPS_API_KEY}&results=1&geocode="
    filename     = 'assets/data.csv'

    FasterCSV.foreach(filename, :quote_char => '"', :col_sep => ';', :row_sep => :auto) do |market|
      next if market[0] == 'id'

      category_title = market[2]
      category       = Category.find_by_title(category_title)

      subcategory = market[3].strip

      address = market[30]

      if phones = market[31]
        phones = phones.gsub('(383)', '')
        phones = phones.split(',')
        phones.map! { |phone| phone.strip }
      end

      if time = market[32]
        time.strip.gsub(/\.$/, '')
      end

      if websites = market[33]
        websites = websites.gsub('http://', '')
        websites = websites.split(',')
        websites.map! { |website| website.strip }
      end

      if emails = market[34]
        emails = emails.split(',')
        emails.map! { |email| email.strip }
      end

      query = URI.encode([market[1], address].join('+'))

      begin
        geocoder = HTTParty.get(geocoder_url + query)
      end until geocoder['ymaps']['GeoObjectCollection']['featureMember']

      coordinates = geocoder['ymaps']['GeoObjectCollection']['featureMember']['GeoObject']['Point']['pos'].split

      record = Market.new({ :category_id => category.id,
                            :subcategory => subcategory,
                            :title       => market[5],
                            :classic     => market[8],
                            :vip         => market[11],
                            :address     => address,
                            :phones      => phones,
                            :time        => time,
                            :websites    => websites,
                            :emails      => emails,
                            :description => market[35],
                            :longitude   => coordinates.first,
                            :latitude    => coordinates.last })
      print '.' if record.save
    end
    puts
  end
end
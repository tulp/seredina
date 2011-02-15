namespace :parser do
  desc "Parse markets"
  task :markets => :environment do
    geocoder_url = "http://geocode-maps.yandex.ru/1.x/?key=#{YANDEX_MAPS_API_KEY}&results=1&geocode="
    filename     = 'assets/data.csv'

    FasterCSV.foreach(filename) do |market|
      query       = URI.encode([market[0], market[14]].join('+'))
      geocoder    = HTTParty.get(geocoder_url + query)
      coordinates = geocoder['ymaps']['GeoObjectCollection']['featureMember']['GeoObject']['Point']['pos'].split
      Market.create({ :subject     => market[2],
                      :title       => market[4],
                      :discount    => market[7],
                      :address     => market[14],
                      :phone       => market[15],
                      :time        => market[16],
                      :website     => market[17],
                      :email       => market[18],
                      :description => market[19],
                      :longitude   => coordinates.first,
                      :latitude    => coordinates.last })
    end
  end
end
namespace :parser do
  desc "Parse markets"
  task :markets => :environment do
    geocoder_url = "http://geocode-maps.yandex.ru/1.x/?key=#{YANDEX_MAPS_API_KEY}&results=1&geocode="
    filename     = 'assets/data.csv'

    FasterCSV.foreach(filename) do |row|
      geocoder = HTTParty.get(geocoder_url + URI.encode([row[0], row[14]].join('+')))
      coordinates = geocoder['ymaps']['GeoObjectCollection']['featureMember']['GeoObject']['Point']['pos'].split
      Market.create({ :subject     => row[2],
                      :title       => row[4],
                      :discount    => row[7],
                      :address     => row[14],
                      :phone       => row[15],
                      :time        => row[16],
                      :website     => row[17],
                      :email       => row[18],
                      :description => row[19],
                      :longitude   => coordinates.first,
                      :latitude    => coordinates.last })
    end
  end
end
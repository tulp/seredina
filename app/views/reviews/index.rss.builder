xml.instruct! :xml, :version => '1.0'
xml.rss :version => '2.0' do
  xml.channel do
    xml.title       t :application_title
    xml.description 'Последние отзывы на «Карте скидок»'

    for review in @reviews
      xml.item do
        xml.title       "Пользователь #{review.user.hidden_email} оставил отзыв:"
        xml.description review.text
        xml.pubDate     review.created_at.to_s(:rfc822)
      end
    end
  end
end

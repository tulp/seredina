class MarketObserver < ActiveRecord::Observer
  observe :review

  def after_create(record)
    market = record.market
    rating = market.reviews.average(:rating).round
    market.update_attribute(:rating, rating)
  end
end

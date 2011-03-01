class Category < ActiveRecord::Base
  has_many :markets

  scope :with_markets_and_reviews, includes(:markets => :reviews)
end

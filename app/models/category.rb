class Category < ActiveRecord::Base
  has_many :markets

  scope :with_markets, includes(:markets)
end

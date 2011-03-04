class Market < ActiveRecord::Base
  belongs_to :category
  has_many   :reviews

  scope :with_reviews, includes(:reviews)
end

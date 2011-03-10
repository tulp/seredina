class Market < ActiveRecord::Base
  serialize :phones
  serialize :emails

  belongs_to :category
  has_many   :reviews

  # scope :with_reviews, includes(:reviews)

  scope :fields_for_json, includes(:category, :reviews => :user)
end

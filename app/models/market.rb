class Market < ActiveRecord::Base
  belongs_to :category

  scope :with_category, includes(:category)
end

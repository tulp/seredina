class Review < ActiveRecord::Base
  belongs_to :market
  belongs_to :user, :counter_cache => true

  validates_presence_of   :text
  validates_uniqueness_of :text, :scope => [:user_id, :market_id]

  validates_numericality_of :rating, :greater_than_or_equal_to => 0, :less_than_or_equal_to => 5
end

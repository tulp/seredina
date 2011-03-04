class Review < ActiveRecord::Base
  belongs_to :market
  belongs_to :user

  validates_presence_of   :text
  validates_uniqueness_of :text, :scope => [:user_id, :market_id]
end

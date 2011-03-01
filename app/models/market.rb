class Market < ActiveRecord::Base
  belongs_to :category
  has_many   :reviews
end

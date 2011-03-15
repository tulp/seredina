class Category < ActiveRecord::Base
  default_scope order(:id)

  has_many :markets
end

class Market < ActiveRecord::Base
  serialize :phones
  serialize :emails
  serialize :websites

  belongs_to :category
  has_many   :reviews
  has_and_belongs_to_many :users

  scope :fields_for_json, includes(:category, :reviews => :user)

  scope :landing, includes(:category)
end

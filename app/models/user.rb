class User < ActiveRecord::Base
  validates :email, :uniqueness => true, :presence => true, :email => true
end

class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable, :confirmable, :validatable

  attr_accessible :email, :password, :password_confirmation

  has_many :reviews

  attr_accessor :temporary_password_accessor

  def set_password
    hash = (Digest::SHA1.new << rand.to_s).to_s
    self.password = self.temporary_password_accessor = hash[0..9]
  end
end

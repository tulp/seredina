class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable, :validatable

  attr_accessible :email, :password, :password_confirmation

  has_many :reviews
  has_many :gifts

  attr_accessor :temporary_password_accessor

  def set_password
    self.password = self.temporary_password_accessor = (Digest::SHA1.new << Time.now.to_s).to_s[0..9]
  end

  def get_gift!
    self.available_gifts += 1
    self.save
  end

  def give_gift!
    self.available_gifts -= 1
    self.save
  end

  def can_give_gifts?
    self.available_gifts > 0
  end
end

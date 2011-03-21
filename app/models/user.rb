class User < ActiveRecord::Base
  devise :database_authenticatable, :validatable

  attr_accessible :email, :password, :name, :phone

  has_many :reviews
  has_many :gifts

  validates_presence_of :phone, :on => :update

  attr_accessor :temporary_password_accessor

  def set_password
    self.password = self.temporary_password_accessor = sha1_key(10)
  end

  def generate_discount_code
    self.discount_code = sha1_key
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

  private

  def sha1_key(length = nil)
    key = (Digest::SHA1.new << Time.now.to_s).to_s
    length ? key[0..length - 1] : key
  end
end

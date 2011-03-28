class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable, :validatable

  attr_accessible :email, :password, :name, :phone

  has_many :reviews
  has_many :gifts
  has_and_belongs_to_many :markets

  validates_presence_of :phone, :on => :update
  validates_presence_of :name,  :on => :update

  attr_accessor :temporary_password_accessor

  def set_password
    self.password = self.temporary_password_accessor = sha1_key(10)
  end

  def generate_discount_code
    self.discount_code = sha1_key
  end

  def confirm_discount
    self.discount_confirmation_token = nil
    self.discount_confirmed_at       = Time.now
  end

  def get_gift!
    update_attribute(:available_gifts, self.available_gifts.next)
  end

  def give_gift!
    update_attribute(:available_gifts, self.available_gifts.pred)
  end

  def can_give_gifts?
    self.available_gifts > 0
  end

  def hidden_email
    self.email.gsub(/([^@]+$)/, '***')
  end

  private

  def sha1_key(length = nil)
    key = (Digest::SHA1.new << Time.now.to_s).to_s
    length ? key[0..length - 1] : key
  end
end

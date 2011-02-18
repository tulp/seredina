class User < ActiveRecord::Base
  attr_accessible :email

  validates :email, :uniqueness => true, :presence => true, :email => true

  before_create :generate_confirmation_token

  def confirm
    self.confirmation_token = nil
    self.confirmed_at       = Time.now
  end

  private

  def generate_confirmation_token
    self.confirmation_token = (Digest::SHA1.new << self.email).to_s
  end
end

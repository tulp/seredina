class Gift < ActiveRecord::Base
  belongs_to :user

  validates :recipient, :presence => true, :uniqueness => true, :format => { :with => Devise.email_regexp }

  before_create :generate_code

  private

  def generate_code
    self.code = KeyGenerator.generate
  end
end

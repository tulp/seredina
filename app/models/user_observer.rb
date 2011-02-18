class UserObserver < ActiveRecord::Observer
  def after_create(user)
    UserMailer.confirmation(user).deliver
  end
end

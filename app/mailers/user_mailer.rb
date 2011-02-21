class UserMailer < ActionMailer::Base
  default :from => 'user_mailer@app_mailers.com'

  def confirmation(user)
    @user = user
    mail  :to => @user.email, :subject => t(:confirmation_subject)
  end
end

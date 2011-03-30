class UserMailer < ActionMailer::Base
  default :from => Devise.mailer_sender

  def give_gift(gift)
    @gift = gift
    mail(:to => @gift.recipient.email, :subject => t(:give_gift_email_subject))
  end

  def confirmation(user)
    @user = user
    mail(:to => @user.email, :subject => t(:confirmation_email_subject))
  end

  def new_password(user)
    @user = user
    mail(:to => @user.email, :subject => t(:new_password_email_subject))
  end
end

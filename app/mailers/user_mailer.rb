class UserMailer < ActionMailer::Base
  default :from => Devise.mailer_sender

  def give_gift(gift)
    @gift = gift
    mail(:to => @gift.recipient, :subject => 'Put into locale')
  end
end
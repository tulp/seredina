require 'tlsmail'

Net::SMTP.enable_tls(OpenSSL::SSL::VERIFY_NONE)

ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.perform_deliveries = true
ActionMailer::Base.raise_delivery_errors = true

ActionMailer::Base.smtp_settings = {
  :enable_starttls_auto => true,
  :address        => 'smtp.gmail.com',
  :port           => 587,
  :domain         => 'gmail.com',
  :authentication => :plain,
  :user_name      => 'jazzcloud.ltd@gmail.com',
  :password       => 'rozenbom778921'
}

Devise.mailer_sender =  'Gold Mailer <jazzcloud.ltd@gmail.com>'
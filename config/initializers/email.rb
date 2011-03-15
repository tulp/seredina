# Be sure to restart your server when you modify this file.

#MAILER_CONF = YAML.load_file(File.join("#{Rails.root}", 'config', 'mailer_config.yml'))

#ActionMailer::Base.delivery_method = :activerecord #For ar_send_mail
ActionMailer::Base.delivery_method = :sendmail
# ActionMailer::Base.default_content_type = "text/html"

#ActionMailer::Base.smtp_settings = {
#  :domain => "",
#  :perform_deliveries => true,
#  :address => '',
#  :port => 25
#}

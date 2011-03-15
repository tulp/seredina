require 'mail'

options = { :address              => "smtp.gmail.com",
            :port                 => 587,
            :domain               => 'gmail.com',
            :user_name            => 'hooxe.o',
            :password             => '4cjWB8YswEtFTv',
            :authentication       => 'plain',
            :enable_starttls_auto => true  }

ActionMailer::Base.delivery_method = :smtp, options

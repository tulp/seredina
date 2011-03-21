class Devise::SessionsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  layout 'landing'

  prepend_before_filter :require_no_authentication, :only => [:new, :create]

  def create
    if params[:user][:password]
      result = if user = warden.authenticate(:scope => resource_name)
        sign_in user
        true
      else
        false
      end
      render :json => result
    else
      unless User.exists?(:email => params[:user][:email])
        user = User.new(params[:user])
        user.set_password
        user.save
        UserMailer.confirmation(user).deliver
      end
      render :nothing => true
    end
  end
end

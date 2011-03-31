class Devise::SessionsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  layout 'landing'

  prepend_before_filter :require_no_authentication, :only => [:new, :create, :send_new_password]

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

  def send_new_password
    if user = User.find_by_email(params[:email])
      user.set_password
      user.save(false) # todo избегать такого
      UserMailer.new_password(user).deliver
    end
    render :nothing => true
  end

  def destroy
    sign_out_and_redirect(resource_name)
  end
end

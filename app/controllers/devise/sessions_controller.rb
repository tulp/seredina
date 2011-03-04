class Devise::SessionsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  def new
    results = [false]
    alert   = flash[:alert]

    if alert.present?
      case alert
      when 'invalid'
        email = params[:user][:email]
        results << (email.blank? ? false : User.exists?(:email => email))
      when 'unconfirmed'
        results << false
      end
      render :json => results
    else
      redirect_to root_path
    end
  end

  def create
    resource = warden.authenticate!(:scope => resource_name, :recall => 'new')
    sign_in resource
    render :json => [true]
  end

  def destroy
    sign_out_and_redirect resource_name
  end
end

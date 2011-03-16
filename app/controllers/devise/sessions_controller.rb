class Devise::SessionsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  def create
    result = if resource = warden.authenticate(:scope => resource_name)
      sign_in resource
      true
    else
      false
    end
    render :json => result
  end

  # временно
  def destroy
    sign_out_and_redirect resource_name
  end
end

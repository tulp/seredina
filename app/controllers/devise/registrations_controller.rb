class Devise::RegistrationsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  def create
    build_resource
    resource.set_password

    result = if resource.save
      sign_in resource
      true
    else
      clean_up_passwords resource
      false
    end
    render :json => result
  end
end

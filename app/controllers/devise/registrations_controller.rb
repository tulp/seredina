class Devise::RegistrationsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  def create
    build_resource
    resource.set_password

    result = if resource.save
      UserMailer.confirmation(resource).deliver
      true
    else
      false
    end

    render :json => result
  end
end

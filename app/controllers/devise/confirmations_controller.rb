class Devise::ConfirmationsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      sign_in_and_redirect(resource_name, resource)
    else
      redirect_to root_path
    end
  end
end

class Devise::RegistrationsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  layout 'landing'

  before_filter :find_user_by_discount_code

  def update
    @user.attributes = params[:user]

    result = if @user.valid?
      @user.clear_discount_code
      @user.save
      sign_in @user
      true
    else
      false
    end
    render :json => result
  end

  private

  def find_user_by_discount_code
    redirect_to new_user_session_path unless @user = User.find_by_discount_code(params[:discount_code])
  end
end

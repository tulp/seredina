class Devise::RegistrationsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  layout 'landing'

  before_filter :find_user_by_discount_confirmation_token

  def update
    @user.attributes = params[:user]

    result = if @user.valid?
      @user.confirm_discount
      @user.save
      sign_in @user
      true
    else
      false
    end
    render :json => result
  end

  private

  def find_user_by_discount_confirmation_token
    redirect_to new_user_session_path unless @user = User.find_by_discount_confirmation_token(params[:discount_confirmation_token])
  end
end

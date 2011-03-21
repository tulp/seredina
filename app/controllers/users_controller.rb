class UsersController < ApplicationController
  before_filter :find_user_by_discount_code

  def show
  end

  def update
    if @user.update_attributes(params[:user])
      sign_in_and_redirect @user
    else
      render :show
    end
  end

  private

  def find_user_by_discount_code
    redirect_to root_url unless @user = User.find_by_discount_code(params[:id])
  end
end

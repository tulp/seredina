class UsersController < ApplicationController
  def create
    User.create params[:user]
    render :nothing => true
  end

  def confirm
    if user = User.find_by_confirmation_token(params[:id])
      user.confirm
      user.save
      flash[:notice] = t :confirmed
    else
      flash[:notice] = t :unconfirmed
    end
    redirect_to root_path
  end
end

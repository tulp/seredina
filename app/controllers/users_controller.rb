class UsersController < ApplicationController
  def create
    user = User.new params[:user]
    user.save
    render :nothing => true
  end
end

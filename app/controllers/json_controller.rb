class JsonController < ApplicationController
  def users
    render :json => User.all.to_json(:only => :email, :methods => :confirmed?)
  end
end

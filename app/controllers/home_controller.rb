class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json { render :json => Market.all.to_json(:only => [:longitude, :latitude]) }
    end
  end
end
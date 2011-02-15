class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json { render :json => Market.select('longitude, latitude') }
    end
  end
end

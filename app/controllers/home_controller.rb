class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render :json => Market.with_category.to_json(:only => [:longitude, :latitude],
                                                     :include => { :category => { :only => :icon_style } })
      end
    end
  end
end

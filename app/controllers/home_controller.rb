class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html { render 'golden_middle/index.haml' }
      format.json do
        render :json => Category.with_markets_and_reviews.to_json(:except => :id,
                                                                  :include => { :markets => { :except => [:id, :category_id, :address, :description, :subject],
                                                                                              :include => { :reviews => { :only => [:text, :rating] } } } })
      end
    end
  end
end

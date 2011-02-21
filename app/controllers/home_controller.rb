class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render :json => Category.with_markets.to_json(:except => :id,
                                                      :include => { :markets => { :except => [:id, :category_id, :address, :description, :subject] } })
      end
    end
  end
end

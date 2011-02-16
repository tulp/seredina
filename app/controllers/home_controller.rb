class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render :json => Market.with_category.to_json(:except => [:id, :subject, :address, :description, :category_id],
                                                     :include => { :category => { :except => :id } })
      end
    end
  end
end

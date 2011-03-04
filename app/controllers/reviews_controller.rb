class ReviewsController < ApplicationController
  before_filter :authenticate_user!

  def create
    if params[:review][:text].present? && Market.exists?(params[:review][:market_id])
      review = current_user.reviews.new(params[:review])
      if review.save
        market = Market.with_reviews.find(params[:review][:market_id])
        render :json => market.to_json(:except => [:category_id, :address, :description, :subject],
                                        :include => { :reviews => { :only => [:text, :rating] } })
      else
        render :json => false
      end
    else
      render :json   => false
    end
  end
end

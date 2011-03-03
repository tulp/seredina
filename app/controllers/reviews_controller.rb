class ReviewsController < ApplicationController
  def create
    Review.create(params[:review]) if Market.exists?(params[:review][:market_id])
    render :nothing => true
  end
end

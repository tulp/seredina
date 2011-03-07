class ReviewsController < ApplicationController
  before_filter :authenticate_user!

  def create
    results = []

    if Market.exists?(params[:review][:market_id])
      review = current_user.reviews.new(params[:review])
      if review.save
        market = Market.with_reviews.find(params[:review][:market_id])
        market_as_json = market.to_json(:except => [:category_id, :address, :description, :subject],
                                        :include => { :reviews => { :only => [:text, :rating] } })
        results = [true, market_as_json, current_user.can_give_gifts?]
      else
        results << false
      end
    else
      results << false
    end
    render :json => results
  end
end

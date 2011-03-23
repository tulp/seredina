class ReviewsController < ApplicationController
  before_filter :authenticate_user!

  def create
    market_id = params[:review][:market_id]

    results = if Market.exists?(market_id)
      review = current_user.reviews.new(params[:review])
      if review.save
        market = Market.fields_for_json.find(market_id)
        user = review.user
        results = [true, user.can_give_gifts?, user.reviews_count % 3 == 0, market.to_json(json_market_options)]
      else
        [false]
      end
    else
      [false]
    end
    render :json => results
  end
end

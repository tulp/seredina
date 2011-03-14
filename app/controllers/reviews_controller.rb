class ReviewsController < ApplicationController
  before_filter :authenticate_user!

  def create
    results = if Market.exists?(params[:review][:market_id])
      review = current_user.reviews.new(params[:review])
      if review.save
        market = Market.fields_for_json.find(params[:review][:market_id])
        market_as_json = market.to_json(:except  => :category_id,
                                        :include => { :category => { :except  => :id },
                                                      :reviews  => { :only    => [:text, :rating],
                                                                     :include => { :user => { :only => :email } } } })
        results = [true, market_as_json, current_user.can_give_gifts?]
      else
        [false]
      end
    else
      [false]
    end
    render :json => results
  end
end

class CollectorController < ApplicationController
  def create
    if user_signed_in? && params[:market_id].present?
      current_user.markets << Market.find_by_id(params[:market_id])
    end
    render :nothing => true
  end
end

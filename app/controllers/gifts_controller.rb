class GiftsController < ApplicationController
  before_filter :authenticate_user!

  def create
    results = if current_user.can_give_gifts?
      gift = current_user.gifts.new(params[:gift])
      [gift.save, gift.user.can_give_gifts?]
    else
      [false]
    end
    render :json => results
  end
end

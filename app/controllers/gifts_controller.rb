class GiftsController < ApplicationController
  before_filter :authenticate_user!

  def create
    result = if current_user.can_give_gifts?
      gift = current_user.gifts.new(params[:gift])
      gift.save
    else
      false
    end
    render :json => result
  end
end

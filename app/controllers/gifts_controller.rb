class GiftsController < ApplicationController
  before_filter :authenticate_user!

  def create
    results = if current_user.can_give_gifts?
      recipient = User.new(:email => params[:recipient_email])
      recipient.set_password
      if recipient.save
        gift = current_user.gifts.new(params[:gift])
        gift.recipient = recipient
        [gift.save, gift.user.can_give_gifts?]
      else
        [false]
      end
    else
      [false]
    end
    render :json => results
  end
end

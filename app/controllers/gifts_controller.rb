class GiftsController < ApplicationController
  before_filter :authenticate_user!

  def create
    results = if current_user.can_give_gifts?
      # TODO nested there
      recipient = User.new(:email => params[:recipient_email], :name => params[:recipient_name])
      recipient.set_password
      recipient.generate_discount_confirmation_token
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

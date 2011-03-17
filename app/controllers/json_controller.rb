class JsonController < ApplicationController
  def markets
    render :json => Market.fields_for_json.to_json(json_market_options)
  end

  def users
    render :json => User.all.to_json(json_user_options)
  end

  def categories
    render :json => Category.all.to_json(:except => :id)
  end

  def current
    result = if user_signed_in?
      current_user.to_json(json_user_options)
    else
      false
    end
    render :json => result
  end

  private

  def json_user_options
    { :only => :email, :methods => :can_give_gifts? }
  end
end

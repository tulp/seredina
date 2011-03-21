class JsonController < ApplicationController
  def markets
    if params[:id]
      markets = Market.fields_for_json.find_by_id(params[:id])
    else
      if params[:category] == 'all'
        markets = Market.fields_for_json
      else
        markets = Category.find_by_icon_image(params[:category]).markets.fields_for_json
      end
    end
    render :json => markets.to_json(json_market_options)
  end

  def categories
    # params[:category]
    render :json => Category.all.to_json(:except => :id)
  end

  def current
    result = if user_signed_in?
      current_user.to_json(:only => :email, :methods => :can_give_gifts?)
    else
      false
    end
    render :json => result
  end
end

class JsonController < ApplicationController
  def markets
    render :json => Market.fields_for_json.to_json(:except  => :category_id,
                                                   :include => { :category => { :only    => :icon_style },
                                                                 :reviews  => { :only    => [:text, :rating],
                                                                                :include => { :user => { :only => :email } } } })

  end

  def users
    render :json => User.all.to_json(:only => :email, :methods => :confirmed?)
  end
end

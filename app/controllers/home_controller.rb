class HomeController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        render :json => Market.fields_for_json.to_json(:except => :category_id,
                                                       :include => { :category => { :except => :id },
                                                                     :reviews => { :only => [:text, :rating],
                                                                                   :include => { :user => { :only => :email } } } })
      end
    end
  end

  # временно
  def gm
    render 'golden_middle/index.haml'
  end
end

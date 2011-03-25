class ApplicationController < ActionController::Base
  protect_from_forgery

  private

  def json_market_options
    { :except  => :category_id,
      :include => { :category => { :except  => :id },
                    :reviews  => { :only    => [:text, :rating],
                                   :include => { :user => { :only => :name, :methods => :hidden_email } } } } }
  end
end

class HomeController < ApplicationController
  def index
  end

  # временно
  def gm
    render 'golden_middle/index.haml'
  end
end

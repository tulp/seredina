class HomeController < ApplicationController
  def index
    @categories = Category.all
  end

  # временно
  def gm
    render 'golden_middle/index.haml'
  end
end

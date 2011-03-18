class HomeController < ApplicationController
  before_filter :authenticate_user!

  def index
    # @review = Review.new
    # @review.rating = 3
    # @work.project_id = params[:pid] unless params[:pid].nil?
  end

  # временно
  def gm
    render 'golden_middle/index.haml'
  end
end

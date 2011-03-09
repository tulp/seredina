class MarketRating < ActiveRecord::Migration
  def self.up
    add_column :markets, :rating, :integer, :default => 0
  end

  def self.down
    remove_column :markets, :rating
  end
end
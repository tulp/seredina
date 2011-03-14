class MarketSubcategory < ActiveRecord::Migration
  def self.up
    add_column :markets, :subcategory, :string
  end

  def self.down
    remove_column :markets, :subcategory
  end
end
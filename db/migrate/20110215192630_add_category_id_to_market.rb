class AddCategoryIdToMarket < ActiveRecord::Migration
  def self.up
    add_column :markets, :category_id, :integer, :null => false
  end

  def self.down
    remove_column :markets, :category_id
  end
end
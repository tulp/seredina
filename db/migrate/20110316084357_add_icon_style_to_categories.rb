class AddIconStyleToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :icon_style, :string
  end

  def self.down
    remove_column :categories, :icon_style
  end
end
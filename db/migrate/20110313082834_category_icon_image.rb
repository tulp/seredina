class CategoryIconImage < ActiveRecord::Migration
  def self.up
    rename_column :categories, :icon_style, :icon_image
  end

  def self.down
    rename_column :categories, :icon_image, :icon_style
  end
end
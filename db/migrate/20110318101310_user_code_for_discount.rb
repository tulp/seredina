class UserCodeForDiscount < ActiveRecord::Migration
  def self.up
    add_column :users, :discount_code, :string
  end

  def self.down
    remove_column :users, :discount_code
  end
end
class ChangeUserDiscountConfirmedAtType < ActiveRecord::Migration
  def self.up
    change_column :users, :discount_confirmed_at, :date
  end

  def self.down
    change_column :users, :discount_confirmed_at, :datetime
  end
end
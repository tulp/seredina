class UserDiscountConfirmationFields < ActiveRecord::Migration
  def self.up
    rename_column :users, :discount_code, :discount_confirmation_token
    add_column    :users, :discount_confirmed_at, :datetime
  end

  def self.down
    remove_column :users, :discount_confirmed_at
    rename_column :users, :discount_confirmation_token, :discount_code
  end
end

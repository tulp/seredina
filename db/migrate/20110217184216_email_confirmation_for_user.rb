class EmailConfirmationForUser < ActiveRecord::Migration
  def self.up
    add_column :users, :confirmation_token, :string
    add_column :users, :confirmed_at,       :datetime
  end

  def self.down
    remove_column :users, :confirmed_at
    remove_column :users, :confirmation_token
  end
end
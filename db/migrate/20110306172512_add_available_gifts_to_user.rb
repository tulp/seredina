class AddAvailableGiftsToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :available_gifts, :integer, :default => 0
  end

  def self.down
    remove_column :users, :available_gifts
  end
end
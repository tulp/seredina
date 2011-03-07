class AddReviewsCount < ActiveRecord::Migration
  def self.up
    add_column :users, :reviews_count, :integer, :default => 0
  end

  def self.down
    remove_column :users, :reviews_count
  end
end

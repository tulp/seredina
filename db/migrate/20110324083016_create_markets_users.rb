class CreateMarketsUsers < ActiveRecord::Migration
  def self.up
    create_table :markets_users, :id => false do |t|
      t.integer :market_id, :null => false
      t.integer :user_id,   :null => false
    end
  end

  def self.down
    drop_table :markets_users
  end
end
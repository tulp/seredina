class CreateReviews < ActiveRecord::Migration
  def self.up
    create_table :reviews do |t|
      t.integer :user_id,   :null => false
      t.integer :market_id, :null => false
      t.text    :text
      t.integer :rating
      t.timestamps
    end
  end

  def self.down
    drop_table :reviews
  end
end

class CreateGifts < ActiveRecord::Migration
  def self.up
    create_table :gifts do |t|
      t.integer :user_id, :null => false
      t.string  :recipient
      t.string  :code
      t.timestamps
    end
  end

  def self.down
    drop_table :gifts
  end
end

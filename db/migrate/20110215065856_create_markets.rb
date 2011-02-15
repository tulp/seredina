class CreateMarkets < ActiveRecord::Migration
  def self.up
    create_table :markets do |t|
      t.string :subject
      t.string :title
      t.string :discount
      t.string :address
      t.string :phone
      t.string :time
      t.string :website
      t.string :email
      t.text   :description
      t.float  :longitude
      t.float  :latitude
    end
  end

  def self.down
    drop_table :markets
  end
end

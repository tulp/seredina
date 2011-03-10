class MarketPhones < ActiveRecord::Migration
  def self.up
    rename_column :markets, :phone, :phones
  end

  def self.down
    rename_column :markets, :phones, :phone
  end
end
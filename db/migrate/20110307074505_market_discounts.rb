class MarketDiscounts < ActiveRecord::Migration
  def self.up
    add_column    :markets, :vip,      :string
    rename_column :markets, :discount, :classic
  end

  def self.down
    rename_column :markets, :classic, :discount
    remove_column :markets, :vip
  end
end
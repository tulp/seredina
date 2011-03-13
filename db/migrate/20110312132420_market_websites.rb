class MarketWebsites < ActiveRecord::Migration
  def self.up
    rename_column :markets, :website, :websites
  end

  def self.down
    rename_column :markets, :websites, :website
  end
end
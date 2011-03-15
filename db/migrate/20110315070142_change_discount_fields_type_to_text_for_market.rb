class ChangeDiscountFieldsTypeToTextForMarket < ActiveRecord::Migration
  def self.up
    change_column :markets, :classic, :text
    change_column :markets, :vip,     :text
  end

  def self.down
    change_column :markets, :classic, :string
    change_column :markets, :vip,     :string
  end
end
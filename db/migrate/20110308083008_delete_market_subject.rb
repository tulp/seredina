class DeleteMarketSubject < ActiveRecord::Migration
  def self.up
    remove_column :markets, :subject
  end

  def self.down
    add_column :markets, :subject, :string
  end
end

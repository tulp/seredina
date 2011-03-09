class RenameEmailToEmailsForMarket < ActiveRecord::Migration
  def self.up
    rename_column :markets, :email, :emails
  end

  def self.down
    rename_column :markets, :emails, :email
  end
end
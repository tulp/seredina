class DeleteCodeAndChangeRecipientForGift < ActiveRecord::Migration
  def self.up
    remove_column :gifts, :code
    rename_column :gifts, :recipient, :recipient_id
    change_column :gifts, :recipient_id, :integer, :null => false
  end

  def self.down
    change_column :gifts, :recipient_id, :string
    rename_column :gifts, :recipient_id, :recipient
    add_column :gifts, :code, :string
  end
end
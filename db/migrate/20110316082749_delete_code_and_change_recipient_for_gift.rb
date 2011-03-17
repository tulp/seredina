class DeleteCodeAndChangeRecipientForGift < ActiveRecord::Migration
  def self.up
    remove_column :gifts, :code
    remove_column :gifts, :recipient
    add_column    :gifts, :recipient_id, :integer, :null => false
  end

  def self.down
    remove_column :gifts, :recipient_id
    add_column :gifts, :recipient, :string
    add_column :gifts, :code,      :string
  end
end
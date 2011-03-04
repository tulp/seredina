class DeviseChangeUsers < ActiveRecord::Migration
  def self.up
    remove_column :users, :email
    remove_column :users, :confirmed_at
    remove_column :users, :confirmation_token

    change_table :users do |t|
      t.database_authenticatable :null => false
      t.confirmable
    end

    add_index :users, :email,              :unique => true
    add_index :users, :confirmation_token, :unique => true
  end

  def self.down
    remove_column :users, :confirmation_sent_at
    remove_column :users, :password_salt
    remove_column :users, :encrypted_password
  end
end
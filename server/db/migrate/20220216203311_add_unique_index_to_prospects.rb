class AddUniqueIndexToProspects < ActiveRecord::Migration[6.1]
  def change
    add_index :prospects, [:user_id, :email], unique: true
  end
end

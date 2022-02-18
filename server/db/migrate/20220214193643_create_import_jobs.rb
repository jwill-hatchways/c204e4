class CreateImportJobs < ActiveRecord::Migration[6.1]
  def change
    create_table :import_jobs do |t|
      t.integer :total
      t.integer :done
      t.string :filename
      t.integer :email_index
      t.integer :first_name_index
      t.integer :last_name_index
      t.boolean :force_overwrite
      t.boolean :has_headers
      t.string :job_status

      t.timestamps
    end
  end
end

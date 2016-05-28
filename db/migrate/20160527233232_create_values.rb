class CreateValues < ActiveRecord::Migration[5.0]
  def change
    create_table :values do |t|
      t.belongs_to :company, index: true
      t.belongs_to :ratio, index: true
      t.integer :year, index: true
      t.decimal :value
      t.timestamps
    end
  end
end

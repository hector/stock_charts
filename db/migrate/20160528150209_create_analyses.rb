class CreateAnalyses < ActiveRecord::Migration[5.0]
  def change
    create_table :analyses do |t|
      t.belongs_to :company
      t.integer :year
      t.string :expert
      t.text :text
      t.timestamps
    end
  end
end

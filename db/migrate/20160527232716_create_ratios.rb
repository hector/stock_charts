class CreateRatios < ActiveRecord::Migration[5.0]
  def change
    create_table :ratios do |t|
      t.string :name
      t.timestamps
    end
  end
end

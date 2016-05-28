class AddCountryAndSector < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :country, :string
    add_column :companies, :sector, :string
  end
end

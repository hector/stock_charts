class Company < ApplicationRecord

  validates :name, uniqueness: true
  validates :ticker, uniqueness: true

  has_many :values

end

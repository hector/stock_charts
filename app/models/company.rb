class Company < ApplicationRecord

  validates :name, uniqueness: true

  has_many :analyses
  has_many :values

end

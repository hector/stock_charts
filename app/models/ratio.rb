class Ratio < ApplicationRecord

  validates :name, uniqueness: true

  has_many :values

end

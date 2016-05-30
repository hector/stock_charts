class Company < ApplicationRecord

  validates :name, uniqueness: true

  has_many :analyses, dependent: :destroy
  has_many :values, dependent: :destroy

end

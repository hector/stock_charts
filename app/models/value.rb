class Value < ApplicationRecord

  validates :company_id, uniqueness: { scope: [:ratio_id, :year]}

  belongs_to :company
  belongs_to :ratio

end

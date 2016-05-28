class Analysis < ApplicationRecord

  validates :year, uniqueness: { scope: [:company_id, :expert] }

  belongs_to :company

end

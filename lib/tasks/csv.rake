namespace :csv do

  desc 'Dump database by value to a CSV'
  task dump_by_value: :environment do
    require 'csv'
    require 'ruby-progressbar'

    bar = ProgressBar.create title: 'Progress', total: Value.count
    CSV.open(Rails.root.join('tmp/database_by_value.csv'), 'w:UTF-8') do |csv|
      # header
      csv << %w(Empresa Ticker País Sector Ratio Año Valor)

      Value.all.each do |value|
        csv << [
            value.company.name,
            value.company.ticker,
            value.company.country,
            value.company.sector,
            value.ratio.name,
            value.year,
            value.value
        ]
        bar.increment
      end
    end
  end

  desc 'Dump database by year to a CSV'
  task dump_by_year: :environment do
    require 'csv'
    require 'ruby-progressbar'


    CSV.open(Rails.root.join('tmp/database_by_year.csv'), 'w:UTF-8') do |csv|
      companies = Company.all
      ratios = Ratio.all
      years = Value.minimum(:year)..Value.maximum(:year)
      bar = ProgressBar.create title: 'Progress', total: years.size * companies.size * ratios.size

      # header
      header = ['Año']
      companies.each do |company|
        ratios.each do |ratio|
          header << "#{company.name}|#{ratio.name}"
        end
      end
      csv << header

      # values
      years.each do |year|
        row = [year]
        companies.each do |company|
          ratios.each do |ratio|
            value = Value.where(company: company, ratio: ratio, year: year).first
            row << value.try(:value)
            bar.increment
          end
        end
        csv << row
      end
    end
  end

  desc 'Dump database by ratio to a CSV'
  task dump_by_ratio: :environment do
    require 'csv'
    require 'ruby-progressbar'

    CSV.open(Rails.root.join('tmp/database_by_ratio.csv'), 'w:UTF-8') do |csv|
      companies = Company.all
      ratios = Ratio.all
      years = Value.minimum(:year)..Value.maximum(:year)
      bar = ProgressBar.create title: 'Progress', total: years.size * companies.size * ratios.size

      # header
      csv << %w(Nombre) + years.to_a + %w(Empresa Ticker Sector Ratio)

      # values
      companies.each do |company|
        ratios.each do |ratio|
          next if Value.where(company: company, ratio: ratio).count < 1 # a company may not have certain ratios
          row = ["#{company.ticker}|#{ratio.name}"]
          years.each do |year|
            value = Value.where(company: company, ratio: ratio, year: year).first
            row << value.try(:value)
            bar.increment
          end
          row << company.name
          row << company.ticker
          row << company.sector
          row << ratio.name
          csv << row
        end
      end
    end
  end

end
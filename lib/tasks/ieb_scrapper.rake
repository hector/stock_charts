require 'capybara'
require 'capybara/dsl'
require 'pp'

desc 'Lee la base de datos de InvierteEnBolsa'
task scrape_ieb: :environment do
  # Use PhantomJS
  require 'capybara/poltergeist'
  Capybara.register_driver :poltergeist_custom do |app|
    Capybara::Poltergeist::Driver.new app,
                                      phantomjs_options: %w(--load-images=no --ignore-ssl-errors=yes)
  end
  Capybara.current_driver = :poltergeist_custom
  Capybara.javascript_driver = :poltergeist_custom

  # Use Firefox
  # Capybara.current_driver = :selenium

  # Capybara.app_host = 'http://www.invertirenbolsa.info'
  Capybara.run_server = false  # disable Rack server, we are accessing a remote web
  Capybara.default_max_wait_time = 5

  Scrapper.new.run
end

class Scrapper
  include Capybara::DSL

  def run
    print 'Fetching companies...'
    visit 'http://www.invertirenbolsa.info/historico_dividendos.htm'

    # Contadores de excepciones
    aviva = 0

    company_tds = []
    all('div.listado.empresas tbody tr').each do |row|
      company_td = row.first 'td'
      company_tds << { name: company_td.text.strip, url: company_td.find('a')['href'] }
    end
    puts "#{company_tds.length} fetched"

    company_tds.each do |company_td|
      next if company_td[:name] < 'Rovi'
      next if company_td[:name] == 'Bodegas Riojanas' # los años no están puestos
      next if company_td[:name] == 'Clínica Baviera' # los años no están puestos

      print "Fetching #{company_td[:name]}..."
      visit company_td[:url]
      company = Company.find_or_initialize_by name: company_td[:name]
      company.ticker = first('div.ficha.empresa table.primera-tabla td.dato').text.strip
      company.country, company.sector = first('h3.subtitulo').text.split('.').map { |o| o.split(':').last.strip }
      company.save!

      within 'table.cuarta-tabla.fht-table-init' do
        years = all('thead th.dato').map { |o| o.text.gsub(/[^\d]/, '').to_i }
        all('tbody tr').each do |row|
          ratio_name = row.find('td.info').text.strip

          next if ratio_name == '' or ratio_name == '%'
          if company.name == 'Aviva' and ratio_name == 'BPA ordinario'
            aviva += 1
            next if aviva == 2
          end

          if ratio_name == 'Observaciones'
            row.all('td.dato').zip(years).each do |td_dato, year|
              next if td_dato.text == ''
              text = td_dato.first('div.hidden-mas-informacion-observaciones', visible: false)['innerHTML']
              text = Rails::Html::FullSanitizer.new.sanitize(text).from(2).strip # remove span element
              analysis = Analysis.find_or_initialize_by company: company, year: year, expert: 'IEB'
              analysis.text = text
              analysis.save!
            end
          else
            ratio = Ratio.find_or_create_by! name: ratio_name
            row.all('td.dato').zip(years).each do |td_dato, year|
              value = td_dato.text.gsub('%', '').strip
              next if value == ''
              value = value.gsub('.', '').gsub(',', '.')
              v = Value.find_or_initialize_by company: company, ratio: ratio, year: year
              v.value = value
              v.save!
            end
          end
        end
      end
      puts 'done'
    end

  end

end
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

spain = Company.find_or_initialize_by name: 'Estado Español'
spain.ticker = 'ESP'
spain.country = 'España'
spain.sector = 'País'
spain.save!

ipc = Ratio.find_or_create_by! name: 'IPC'
ipc_var = Ratio.find_or_create_by! name: 'IPC [Var%]'
ipca = Ratio.find_or_create_by! name: 'IPCA'
ipca_var = Ratio.find_or_create_by! name: 'IPCA [Var%]'
pib = Ratio.find_or_create_by! name: 'PIB'
pib_var = Ratio.find_or_create_by! name: 'PIB [Var%]'
ratios = [ipc, ipc_var, ipca, ipca_var, pib, pib_var]

# Source: http://www.ine.es/
data = [
    # [year, ipc, ipc_var, ipca, ipca_var, pib, pib_var]
    [1995, nil, nil, nil, nil, '459337', nil],
    [1996, nil, nil, nil, nil, '487992', '6.24'],
    [1997, nil, nil, '66.15', nil, '518049', '6.16'],
    [1998, nil, nil, '67.31', '1.7', '554042', '6.95'],
    [1999, nil, nil, '68.82', '2.2', '594316', '7.27'],
    [2000, nil, nil, '71.22', '3.4', '646250', '8.74'],
    [2001, nil, nil, '73.23', '2.7', '699528', '8.24'],
    [2002, '78.522', '3.5', '75.86', '3.5', '749288', '7.11'],
    [2003, '80.399', '3.0', '78.21', '3.0', '803472', '7.23'],
    [2004, '83.399', '3.0', '80.6', '3.0', '861420', '7.21'],
    [2005, '86.208', '3.4', '83.33', '3.3', '930566', '8.03'],
    [2006, '89.239', '3.5', '86.29', '3.4', '1007974', '8.32'],
    [2007, '91.726', '2.8', '88.75', '2.8', '1080807', '7.23'],
    [2008, '95.464', '4.1', '92.41', '4.0', '1116207', '3.28'],
    [2009, '95.190', '-0.3', '92.19', '-0.2', '1079034', '-3.33'],
    [2010, '96.903', '1.8', '94.08', '2.0', '1080913', '0.17'],
    [2011, '100.00', '3.2', '96.94', '3.0', '1070413', '-0.97'],
    [2012, '102.446', '2.4', '99.31', '2.4', '1042872', '-2.57'],
    [2013, '103.889', '1.4', '100.83', '1.5', '1031272', '-1.11'],
    [2014, '103.732', '-0.2', '100.63', '-0.2', '1041160', '0.96'],
    [2015, '103.213', '-0.5', '100.0', '-0.6', nil, nil],
]

data.each do |year, *values|
  values.zip(ratios).each do |value, ratio|
    next unless value
    Value.create! company: spain, ratio: ratio, year: year, value: value
  end
end
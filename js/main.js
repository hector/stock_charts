var datatable = function () {
    return _datatable || $('#datos').DataTable();
};

var init_complete = function () {
    // Add global search
    $('#global-search').on('keyup', function () {
        datatable().search(this.value).draw();
    });
    // Add column filters
    var filters_body = $('#filters-body');
    this.api().columns().every(function () {
        var column = this;
        if ($(column.header()).hasClass('year')) return;

        // Recover selected filter
        var option_val = datatable().state().columns[column.index()].search.search;
        option_val = option_val.substring(1, option_val.length-1);

        var label = $('<label class="col-sm-2">'+column.header().innerHTML+'</label>');
        var select = $('<select class="form-control input-sm"><option value=""></option></select>')
            .appendTo(label)
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                column
                    .search(val ? '^' + val + '$' : '', true, false)
                    .draw();
            });

        column.data().unique().sort().each(function (d, j) {
            var s = (d == option_val) ? ' selected' : '';
            select.append('<option value="' + d + '"' + s + '>' + d + '</option>')
        });
        filters_body.append(label);
    });
    // Add reset filters button
    var col = $('<div id="reset-filters" class="col-sm-2 text-center"></div>');
    var reset_btn = $('<button class="btn btn-default">Borrar filtros</button>')
        .appendTo(col)
        .on('click', function (){
            filters_body.find(':input')
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            datatable().search( '' ).columns().search( '' ).draw();
        });
    filters_body.append(col);
};

var state_loaded = function (settings, data) {
    $('#global-search').val(data.search.search);
};

var _datatable = null, chart = null;

$(function() {
    data = [
        [1243987200000,20.14],
        [1244073600000,20.53],
        [1244160000000,20.67],
        [1244419200000,20.55],
        [1244505600000,20.39],
        [1244592000000,20.04],
        [1244678400000,19.99],
        [1244764800000,19.57],
        [1245024000000,19.44],
        [1245110400000,19.48],
        [1245196800000,19.37],
        [1245283200000,19.41],
        [1245369600000,19.93],
        [1245628800000,19.62],
        [1245715200000,19.14],
        [1245801600000,19.46],
        [1245888000000,19.98],
        [1245974400000,20.35],
        [1246233600000,20.28],
        [1246320000000,20.35],
        /* Jul 2009 */
        [1246406400000,20.40],
        [1246492800000,20.00],
        [1246838400000,19.80],
        [1246924800000,19.34],
        [1247011200000,19.60],
        [1247097600000,19.48],
        [1247184000000,19.79],
        [1247443200000,20.33],
        [1247529600000,20.32],
        [1247616000000,20.98],
        [1247702400000,21.07],
        [1247788800000,21.68],
        [1248048000000,21.84],
        [1248134400000,21.64],
        [1248220800000,22.39],
        [1248307200000,22.55],
        [1248393600000,22.86],
        [1248652800000,22.87],
        [1248739200000,22.86],
        [1248825600000,22.86],
        [1248912000000,23.26],
        [1248998400000,23.34]
    ]
    // Chart
    chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'chart'
        }
    });
    chart.addSeries({
        name : 'AAPL Stock Price',
        data : data,
        marker : {
            enabled : true,
            radius : 3
        },
        shadow : true,
        tooltip : {
            valueDecimals : 2
        }
    });

    // Datatable
    _datatable = $('#datos').DataTable({
        ajax: 'ieb.json',
        deferRender: true,
        columns: [
            { data: 0 },
            { data: 1 },
            { data: 2 },
            { data: 3 },
            { data: 4 },
            { data: 5 },
            { data: 5 },
            { data: 6 },
            { data: 7 },
            { data: 8 },
            { data: 9 },
            { data: 10 },
            { data: 11 },
            { data: 12 },
            { data: 13 },
            { data: 14 },
            { data: 15 },
            { data: 16 },
            { data: 17 },
            { data: 18 },
            { data: 19 },
            { data: 20 },
            { data: 21 },
            { data: 22 },
            { data: 23 },
            { data: 24 },
            { data: 25 },
            { data: 26 },
            { data: 27 },
            { data: 28 },
            { data: 29 },
            { data: 30 },
            { data: 31 },
            { data: 32 }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json',
            select: {
                rows: {
                    _: "Hay %d filas seleccionadas",
                    0: "Haz clic en una fila para añadirla al gráfico",
                    1: "Hay 1 fila seleccionada"
                }
            }
        },
        dom: "<'row'<'col-sm-6'l><'col-sm-6'B>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        scrollX: true,
        stateSave: true,
        // Callbacks
        initComplete: init_complete,
        stateLoaded: state_loaded,
        // Extensions
        fixedColumns: {
            leftColumns: 4
        },
        select: {
            style: 'multi+shift'
        },
        buttons: [
            {
                extend: 'selectNone',
                text: 'Borrar selección'
            },
            {
                extend: 'collection',
                text: 'Exportar',
                buttons: ['copy', 'excel', 'pdf']
            },
            {
                extend: 'colvis',
                text: 'Ver columnas',
                collectionLayout: 'fixed two-column'
            }
        ]
    });
    _datatable.on('select', function (e, datatable, type, indexes) {
        if (type != 'row') return;
        indexes.forEach(function(index) {
            datatable.rows(index)
        });
    });
});
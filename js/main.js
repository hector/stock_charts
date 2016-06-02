var _chart = null;
var chart = function () {
    if (_chart == null) {
        _chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'chart'
            },
            rangeSelector: {
                inputDateFormat: '%Y',
                inputEditDateFormat: '%Y'
            }
        });
    }
    return _chart;
};

var _datatable = null;
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
            var s = (d.replace(/\\/g, '') == option_val.replace(/\\/g, '')) ? ' selected' : '';
            select.append('<option value="' + d + '"' + s + '>' + d + '</option>')
        });
        filters_body.append(label);
    });
};

var state_loaded = function (settings, data) {
    $('#global-search').val(data.search.search);
};

$(function() {
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
            { data: 32 },
            { data: 33 },
            { data: 34 }
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
            leftColumns: 5
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

    // Reset filters button
    $('#reset-filters-btn').on('click', function (){
        $(':input', '#filters-body')
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
        datatable().search( '' ).columns().search( '' ).draw();
    });

    // Draw selected row
    var rowSeries = {};
    _datatable.on('select', function (e, datatable, type, indexes) {
        if (type != 'row') return;
        var headers = datatable.columns().header(),
            row, values, year, value;
        indexes.forEach(function(index) {
            var data = [];
            row = datatable.rows(index);
            values = row.data()[0];
            for(var i=(headers.length-1); i>4; i--) {
                year = new Date(headers[i].innerHTML + '-01-01T00:00:00').valueOf();
                value = values[i] ? parseFloat(values[i]) : null;
                data.push([year, value]);
            }
            rowSeries[index] = chart().addSeries({
                name: values[1] + " " + values[4],
                data: data,
                marker : {
                    enabled : true,
                    radius : 3
                },
                shadow : true,
                tooltip : {
                    valueDecimals : 2
                }
            });
        });
    });

    // Erase unselected row
    _datatable.on('deselect', function (e, datatable, type, indexes) {
        if (type != 'row') return;
        var series;
        indexes.forEach(function(index) {
            series = rowSeries[index];
            if (series) {
                series.remove();
                delete rowSeries[index]
            }
        });
    });
});
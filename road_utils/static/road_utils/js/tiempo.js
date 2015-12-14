$(document).ready(function () {
    var json;

    // petición del pronóstico del tiempo
    $.ajax({
        type: 'POST',
        url: '/road_utils/obtenertemperatura',
        success: function (data) {
            json = JSON.parse(data);

            for (var i = 0; i < json.length; i++) {
                $('select[name=comarcas]')
                    .append($('<option></option>')
                        .attr("value", i)
                        .text(json[i].comarca));
            }
        },

        error: function (xhr, textStatus, errorThrown) {
            alert("Error al enviar el mensaje. Intentelo más tarde.");
            console.log('Error description: ' + errorThrown + '\n' +
                'Status: ' + xhr.status + '\n' +
                'Response text: ' + xhr.responseText + '\n');
        }
    });
    
    // cargar información tiempo
    function cargarInfoTiempo(opc) {
        $('#cuadro-flotante-imgtemp').attr('src', 'http://opendata.euskadi.eus' + json[opc]['iconotemp']);
        $('#cuadro-flotante-imgtiempo').attr('src', 'http://opendata.euskadi.eus' + json[opc]['iconotiempo']);
        $('#tiempo-descr').html(json[opc].descripciontiempo + ".<br>" + json[opc].descr);
        $('#temp-descr').html(json[opc].descripciontemp + ".<br>");
        $('#descr').html(json[opc].descr);
    }
    
    // seleccionar comarca
    $('select[name=comarcas]').change(function() {
       var opc = $('select[name=comarcas] option:selected').val();
       
       cargarInfoTiempo(opc); 
    });
    
    // al cargar la página mostrar información por defecto
    setTimeout(cargarInfoTiempo, 300, 0);
});
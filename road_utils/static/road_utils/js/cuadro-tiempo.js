$(document).ready(function () {
    var json;
    
    // movimiento del cuadro flotante
    var posicion = $(".cuadro-flotante").offset();
    var margenSuperior = 60;

    $(window).scroll(function () {
        var width = $(window).width();
        
        if (width >= 1000) {
            if ($(window).scrollTop() > posicion.top) {
                $(".cuadro-flotante").stop().animate({
                    marginTop: $(window).scrollTop() - posicion.top + margenSuperior
                });
            } else {
                $(".cuadro-flotante").stop().animate({
                    marginTop: 0
                });
            };   
        }
    });

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
			
			cargarInfoTiempo(0);
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
        
        var txt = json[opc].descripciontemp + ".<br>" + json[opc].descripciontiempo + ".<br>" + json[opc].descr;
        $('#cuadro-flotante-descr').html(txt.substring(0, 100) + "...");
    }
    
    // aumentar/reducir descripción
    $('#mas-menos').click(function () {
        var opc = $('select[name=comarcas] option:selected').val();
        var val = $('#mas-menos').attr('class');
        var txt = json[opc].descripciontemp + ".<br>" + json[opc].descripciontiempo + ".<br>" + json[opc].descr;
        
        if (val === 'glyphicon glyphicon-plus fake-text') {
            $('#cuadro-flotante-descr').html(txt);
            $('#mas-menos').attr('class', 'glyphicon glyphicon-minus fake-text');
        } else {
            $('#cuadro-flotante-descr').html(txt.substring(0, 100) + "...");
            $('#mas-menos').attr('class', 'glyphicon glyphicon-plus fake-text');
        }
    });
    
    // seleccionar comarca
    $('select[name=comarcas]').change(function() {
       var opc = $('select[name=comarcas] option:selected').val();
       
       cargarInfoTiempo(opc); 
    });
    
    // cerrar ventana
    $('#cuadro-flotante-cerrar').click(function () {
        $('.cuadro-flotante').fadeOut();
    });
});
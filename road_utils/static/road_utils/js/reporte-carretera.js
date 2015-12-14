$(document).ready(function() {
	// on document load
	$('input[name=fecha]').val(getTimestamp());
	
	// event listeners
	// check format of the DNI
	$('input[name=dni]').focusout(function() {
		var dni = $('input[name=dni]').val();
		if (!checkDNI(dni)) {
			$('input[name=dni]').val("");
			$('input[name=dni]').css("background", "#FF6347");
		} else {
			$('input[name=dni]').css("background", "");
		}
	});
	
	// check kilometer is a number
	$('input[name=kilometro]').focusout(function() {
		var kilometer = $('input[name=kilometro]').val().trim();
		
		if (!isNumeric(kilometer)) {
			$('input[name=kilometro]').val("");
			$('input[name=kilometro]').css("background", "#FF6347");
		} else {
			$('input[name=kilometro]').css("background", "");
		}
	});
	
	// check if required fields are filled
	$('#submit').click(function() {
		var road, kilometer, dni, descr;

		dni = $('input[name=dni]').val();
		road = $('input[name=carretera]').val().trim();
		kilometer = $('input[name=kilometro]').val().trim();
		descr = $('textarea[name=descripcion]').val().trim();
		
		if (dni === "" || road === "" || kilometer === "" || descr === "") {
			if (road === "") {
				$('input[name=carretera]').css("background", "#FF6347");
			} else {
				$('input[name=carretera]').css("background", "");
			}
			
			if (kilometer === "") {
				$('input[name=kilometro]').css("background", "#FF6347");
			} else {
				$('input[name=kilometro]').css("background", "");
			}
			
			if (dni === "") {
				$('input[name=dni]').css("background", "#FF6347");
			} else {
				$('input[name=dni]').css("background", "");
			}
			
			if (descr === "") {
				$('textarea[name=descripcion]').css("background", "#FF6347");
			} else {
				$('textarea[name=descripcion]').css("background", "");
			}
		} else {
			// send data
			$.ajax( {
				type: "POST",
				url: "/road_utils/mandarreporte",
				data: {
					dni: $('input[name=dni]').val(),
					carretera: $('input[name=carretera]').val(),
					kilometro: $('input[name=kilometro]').val(),
					sentido: $('input[name=sentido]').val(),
					fecha: $('input[name=fecha]').val(),
					descripcion: $('textarea[name=descripcion]').val(),
				},
				success: function() {
					var tmp = '<h3>Información enviada correctamente.</h3>'
					
					$('#form').remove();
					$('#content').append(tmp);
				},
				error: function(xhr, textStatus, errorThrown) {
					alert("Error al enviar el mensaje. Intentelo más tarde.");
					console.log('Error description: ' + errorThrown + '\n' + 
						'Status: ' + xhr.status + '\n' +
						'Response text: ' + xhr.responseText + '\n');
				}
			});
		}
	});
});
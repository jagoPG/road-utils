$(document).ready(function() {
	// on document load
	$('input[name=fechahora]').val(getTimestamp());
	
	// functions
	function checkGeneralData() {
		var isCorrect = true;
		var isVictims;
		
		if ($('input[name=location]').val().trim() === "") {
			isCorrect = false;
			$('input[name=location]').css("background", "#FF6347");
		}	else {
			$('input[name=location]').css("background", "");
		}
		
		if ((isVictims = $('input[name=victims]:checked').val()) == null) {
			isCorrect = false;
			$('#victimas').css('color', 'red');
		} else {
			$('#victimas').css('color', 'black');
		}
		
		return isCorrect; 
	}
	
	function checkVehicle1Data() {
		var isCorrect = true;
		
		checkTextInput($('input[name=dni1]'));
		checkTextInput($('input[name=matvehiculo1]'));
		checkTextInput($('input[name=nom_aseguradora1]'));
		checkTextInput($('input[name=num_poliza1]'));
		checkTextInput($('textarea[name=circunstancias1]'));
		checkTextInput($('input[name=ptoschoque1]'));
		checkTextInput($('input[name=daños1]'));
		
		return isCorrect;
	}
	
	function checkVehicle2Data() {
		var isCorrect = true;
		
		checkTextInput($('input[name=dni2]'));
		checkTextInput($('input[name=matvehiculo2]'));
		checkTextInput($('input[name=nom_aseguradora2]'));
		checkTextInput($('input[name=num_poliza2]'));
		checkTextInput($('textarea[name=circunstancias2]'));
		checkTextInput($('input[name=ptoschoque2]'));
		checkTextInput($('input[name=daños2]'));
		
		return isCorrect;
	}
	
	// event listeners
	$('#submit').click(function() {
		var isCorrect = checkGeneralData() && checkVehicle1Data() && checkVehicle2Data();
		
		checkGeneralData();
		checkVehicle1Data();
		checkVehicle2Data();
		
		if (isCorrect) {
			$.ajax( {
				type: "POST",
				url: "/road_utils/mandaraccidente",
				data: {
					timestamp: $('input[name=fechahora]').val(),
					localizacion: $('input[name=location]').val(),
					victimas: $('input[name=victims]').val(),
					danosMateriales: $('input[name=damages]').val(),
					testigos: $('textarea[name=witness]').val(),
					
					dni1: $('input[name=dni1]').val(),
					matricula1: $('input[name=matvehiculo1]').val(),
					matriculaRemolque1: $('input[name=matremolque1]').val(),
					aseguradora1: $('input[name=nom_aseguradora1]').val(),
					num_poliza1: $('input[name=num_poliza1]').val(),
					num_carta_verde1: $('input[name=num_cartav1]').val(),
					circunstancias1: $('textarea[name=circunstancias1]').val(),
					puntos_choque1: $('input[name=ptoschoque1]').val(),
					danos1: $('input[name=daños1]').val(),
					observaciones1: $('input[name=comentarios1]').val(),
					
					dni2: $('input[name=dni2]').val(),
					matricula2: $('input[name=matvehiculo2]').val(),
					matriculaRemolque2: $('input[name=matremolque2]').val(),
					aseguradora2: $('input[name=nom_aseguradora2]').val(),
					num_poliza2: $('input[name=num_poliza2]').val(),
					num_carta_verde2: $('input[name=num_cartav2]').val(),
					circunstancias2: $('textarea[name=circunstancias2]').val(),
					puntos_choque2: $('input[name=ptoschoque2]').val(),
					danos2: $('input[name=daños2]').val(),
					observaciones2: $('input[name=comentarios2]').val(),
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
	
	$('input[name=dni1]').focusout(function() {
		var dni = $('input[name=dni1]').val();
		
		if (!checkDNI(dni)) {
			$('input[name=dni1]').val('');
			$('input[name=dni1]').css('background', '#FF6347');
		} else {
			$('input[name=dni1]').css('background', '');
		}
	});
	
	$('input[name=dni2]').focusout(function() {
		var dni = $('input[name=dni2]').val();
		
		if (!checkDNI(dni)) {
			$('input[name=dni2]').val('');
			$('input[name=dni2]').css('background', '#FF6347');
		} else {
			$('input[name=dni2]').css('background', '');
		}
	});
});
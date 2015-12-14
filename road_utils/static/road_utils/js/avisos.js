$(document).ready(function() {
	var geoUpdates;
	
	function showPosition(pos) {
		$('input[name=latitud]').val(pos.coords.latitude);
		$('input[name=longitud]').val(pos.coords.longitude);
		
		$.ajax({
			type: "POST",
			url: "/road_utils/getaviso",
			data: {
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude,
			},
			success: function(resp) {
				resp = JSON.parse(resp);
				if (resp == '') {
					$('#img').attr('src', '/static/road_utils/images/señales/fin.png');
				} else {
					switch (resp.tipo) {
						case 'Otras incidencias':
						case 'Accidente':
							$('#img').attr('src', '/static/road_utils/images/señales/alert.png');
							break;
						case 'Seguridad vial':
							switch (resp.causa) {
								case 'Desprendimiento':
									$('#img').attr('src', '/static/road_utils/images/señales/desprendimiento.png');
									break;
								case 'Caída de objetos':
									$('#img').attr('src', '/static/road_utils/images/señales/caida-objetos.png');
									break;
							}
							break;
						case 'Meteorológica':
							switch (resp.causa) {
								case 'Agua':
									$('#img').attr('src', '/static/road_utils/images/señales/lluvia.png');
									break;
								case 'Nieve':
									$('#img').attr('src', '/static/road_utils/images/señales/nieve.png');
									break;
							}
							break;
						case 'Obras':
							$('#img').attr('src', '/static/road_utils/images/señales/obras.png');
							break;
						default:
							$('#img').attr('src', '/static/road_utils/images/señales/fin.png');
					}
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert("Error al enviar el mensaje. Intentelo más tarde.");
				console.log('Error description: ' + errorThrown + '\n' + 
					'Status: ' + xhr.status + '\n' +
					'Response text: ' + xhr.responseText + '\n');
			}
		});
	}
	
	function errorHandler(err) {
		switch (err.code) {
		case 1:
			console.log('Error: access denied');
			break;
		case 2:	
			console.log('Error: position is unavailable');
			break;
		}
	}
	
	// activate geolocation
	$('input[name=geolocation]').click(function() {
		if ($('input[name=geolocation]:checked').val() != null) {
			// subscribe to GPS position updates
			var geoLocation = navigator.geolocation;
		
			if (geoLocation) {
				var options = { timeout: 2000 };
				geoUpdates = geoLocation.watchPosition(showPosition, errorHandler, options);	
			} else {
				console.log('Error: geolocation not supported');
			}
		} else {
			// unsubscribe from GPS position updates
			if (geoUpdates != null) {
				navigator.geolocation.clearWatch(geoUpdates);
			}
		}
		
	});
	
	$('#bSend').click(function() {
		$.ajax({
			type: "POST",
			url: "/road_utils/getaviso",
			data: {
				latitude: $('input[name=latitud]').val(),
				longitude: $('input[name=longitud]').val(),
			},
			success: function(resp) {
				resp = JSON.parse(resp);
				if (resp == '') {
					$('#img').attr('src', '/static/road_utils/images/señales/fin.png');
				} else {
					switch (resp.tipo) {
						case 'Otras incidencias':
						case 'Accidente':
							$('#img').attr('src', '/static/road_utils/images/señales/alert.png');
							break;
						case 'Seguridad vial':
							switch (resp.causa) {
								case 'Desprendimiento':
									$('#img').attr('src', '/static/road_utils/images/señales/desprendimiento.png');
									break;
								case 'Caída de objetos':
									$('#img').attr('src', '/static/road_utils/images/señales/caida-objetos.png');
									break;
							}
							break;
						case 'Meteorológica':
							switch (resp.causa) {
								case 'Agua':
									$('#img').attr('src', '/static/road_utils/images/señales/lluvia.png');
									break;
								case 'Nieve':
									$('#img').attr('src', '/static/road_utils/images/señales/nieve.png');
									break;
							}
							break;
						case 'Obras':
							$('#img').attr('src', '/static/road_utils/images/señales/obras.png');
							break;
						default:
							$('#img').attr('src', '/static/road_utils/images/señales/fin.png');
					}
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert("Error al enviar el mensaje. Intentelo más tarde.");
				console.log('Error description: ' + errorThrown + '\n' + 
					'Status: ' + xhr.status + '\n' +
					'Response text: ' + xhr.responseText + '\n');
			}
		});
				
	});
	
});
	// utility functions
	// check if the DNI is correct
	function checkDNI(dni) {
		if (dni.length == 9) {			
			try {
				var numbers = parseInt(dni.substring(0, 8));
				
				if ('TRWAGMYFPDXBNJZSQVHLCKE'.charAt(numbers % 23) == dni.substring(8)) {
					return true;
				}				
			} catch (err) {
				return false;
			}
			
			return false;	
		}
	}
	
	// get actual timestamp
	function getTimestamp() {
		var date = new Date();
		
		return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + 
		date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}
	
	// check whether is a number or not 
	function isNumeric(n) {
  		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	// check text input
	function checkTextInput(input) {
		if ($(input).val().trim() === "") {
			$(input).css("background", "#FF6347");
			return false;
		} else {
			$(input).css("background", "");
			return true;
		}
	}
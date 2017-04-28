openRecommendationsModal = function() {
	document.getElementById('requestModal').className += " displayRequestModal";
	document.getElementById('modalMask').className += " displayRequestModal";
}

closeRecommendationsModal = function() {
	document.getElementById('requestModal').classList.remove("displayRequestModal");
	document.getElementById('modalMask').classList.remove("displayRequestModal");
}

dismissAlert = function() {
	document.getElementById('alerts').remove()
}

const templateValidate = Handlebars.compile($('#validateTmpl').html());
const validateSec = $('#validateSection');
$( "#questionInput" ).bind('input propertychange', $.debounce(function() {
	$.ajax({
	  url: '/pagevalidate',
	  data: {
	    q: this.value
	  },
	  success: function( result ) {
			$( "#questionPageId").val(result.id)
			validateSec.html(templateValidate(result))
	  }
	});
}, 1500));

setNav = function () {
	const navIndex = document.getElementById('appNav').getAttribute('data-navIndex');
	switch(navIndex) {
    case 'home':
        document.getElementById('requestsNavButton').classList += ' currentPage';
        break;
    case 'search':
        document.getElementById('connectionsNavButton').classList += ' currentPage';
        break;
    case 'notifications':
        document.getElementById('notificationsNavButton').classList += ' currentPage';
    		break
		case 'newpage':
        document.getElementById('newpageNavButton').classList += ' currentPage';
    		break
		case 'user':
        document.getElementById('userNavButton').classList += ' currentPage';
    		break
    default:
        ''
	}
}

window.onload = function() {
	setNav();
}
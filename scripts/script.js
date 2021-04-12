/* Synergix Prototype - scripts to run partials, is applied via lazy-loading */

// polyfill for .matches() support

var getClosest = function (elem, selector) {
	
	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;
};

// 'Chosen treatment' highlighted css class applied on 'Choose treatment' intermediate page
var tableObj = document.querySelectorAll(".product-chooser table");

if (tableObj) {
	for (var i = 0, len = tableObj.length; i < len; i++) {
		tableObj[i].addEventListener("click", function (e) {
			
			// Get the parent 'tr' of the selected radio button with the `.product-row` class
			var parent = getClosest(e.target, ".product-row");

			var radioTarget = parent.querySelector("input[type='radio']");
			radioTarget.checked = true;

			// Targetted radio button with `.qa-select-product`
			if ( parent ) {
				// Remove possible previous selected class
				var oldSelection = document.querySelector(".selectedProduct")
				if (oldSelection) {
					oldSelection.classList.remove("selectedProduct");
				}
				// Add the `.selectedProduct` class to the 'tr' of the 'Chosen treatment'
				parent.classList.add("selectedProduct");
			}
		}, false);
	}
}


// toggleIntermediatePages: toggles static pages / 'intermediate' partials to appear between 'Assessment' and 'Assessment Outcome'; removes branded header & footer from the 'Assessment Outcome', to simulate a 'GP view'.

function toggleIntermediatePages(){
	//console.log("toggleIntermediatePages ");//!!
	var intermediatePages = document.getElementById("intermediatePages");
	var outcomeDisplay = document.getElementById("outcomeDisplay");
	var outcomeHeader = document.getElementById("brandedHeader");
	var outcomeFooter = document.getElementById("brandedFooter");
	var bottomNav = document.getElementById("bottomNav");
	intermediatePages.classList.toggle("hide");
	outcomeDisplay.classList.toggle("hide");
	outcomeHeader.classList.toggle("hide");
	outcomeFooter.classList.toggle("hide");
	bottomNav.classList.toggle("hide");
	document.getElementById("backButton").classList.toggle("hide");
	var nextButton = document.getElementById("nextButton");
	addClass(nextButton, "hide");
}


// confirmTreatment: navigates between intermediate pages - 'Choose Treatement', 'Telephone Consultation' & 'Order Confirmation' - based on radio button selection on the 'intermediate' partial files. 

function confirmTreatment(telephoneConsultationFlag) { 
	//console.log("confirmTreatment telephoneConsultationFlag=" + telephoneConsultationFlag);//!!
	var radios = document.getElementsByName('selected'); // all radio buttons
	var radioPhone = document.getElementById('radioPhone'); // telephone consultation radio button
	var telephone = document.getElementById("telephoneConsultation"); // telephone consultation intermediate page
	var choose = document.getElementById("chooseTreatment"); // choose treatment intermediate page (default landing intermediate page) 
	var review = document.getElementById("reviewConfirmation"); // order confirmation intermediate page
	var selectFlag = false; // flag disables alertbox when set as true
	
	if (!choose || !review || !telephone) {
		console.log("choose = " + choose + " review=" + review + " telephone=" + telephone);//!!
	}
	
	function telephoneConsultation() {
		addClass(choose,"hide");
		addClass(review,"hide");
		removeClass(telephone,"hide");
		document.body.classList.toggle("phoneBg");
		selectFlag = true; // disable alertbox
	}
	
	// if going back from the telephone consultation page
	if (telephoneConsultationFlag && telephoneConsultationFlag == "backFromTelephoneConsultation"){
		//console.log("backFromTelephoneConsultation");//!!
		addClass(review,"hide");
		addClass(telephone,"hide");
		document.body.classList.toggle("phoneBg");
		removeClass(choose,"hide");
		selectFlag = true; // disable alertbox
	}
	// if going back from the Review Confirmation page
	else if (telephoneConsultationFlag && telephoneConsultationFlag == "backFromReviewConfirmation"){
		//console.log("backFromReviewConfirmation");//!!
		addClass(review,"hide");
		removeClass(choose,"hide");
		selectFlag = true; // disable alertbox
	}
	// if jumping from the blue "Request consultation" button to the telephone consultation page
	else if (telephoneConsultationFlag){
		//console.log("telephoneConsultationFlag true");//!!
		toggleIntermediatePages();
		telephoneConsultation();
	}
	// if they didn't get here via the back button
	else {
		for (var i = 0, len = radios.length; i < len; i++) {
			//console.log(i + "  radios[i].checked = " + radios[i].checked);//!!
			if (radios[i].checked == true && radioPhone.checked == true ) { // telephone consultation treatment radio button is selected
				telephoneConsultation();
				break;
			} else if (radios[i].checked == true ) { // any other treatment radio button is selected
				choose.classList.toggle("hide"); // toggle visibility of choose treatment page
				review.classList.toggle("hide"); // toggle visibility of order confirmation page
				selectFlag = true; // disable alertbox
				break
			} 
		}
	}
	if (!selectFlag) {
		alert('Please, select a product to continue'); // If no treatment radio buttons are selected, and alertbox is triggered
	}
	
	// End of the loop, return false
	return false;
}
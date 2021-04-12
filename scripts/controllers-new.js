// synergixPrototypeApp Controller for consultation page - plots questions - coded by Mark Mulrooney

//https://async.doctorcareanywhere.com/prototype/consultation.html?route=chlamydia-treatment-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=chlamydia-treatment-01

//https://async.doctorcareanywhere.com/prototype/consultation.html?route=contraceptive-pill-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=contraceptive-pill-3month-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=contraceptive-pill-6month-01

//https://async.doctorcareanywhere.com/prototype/consultation.html?route=erectile-dysfunction-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=erectile-dysfunction-recommend-01

//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=genital-herpes-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=genital-herpes-suppression-01

//https://async.doctorcareanywhere.com/prototype/consultation.html?route=hair-loss-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=hair-loss-01

//https://async.doctorcareanywhere.com/prototype/consultation.html?route=morning-after-pill-ellaone-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=morning-after-pill-ellaone-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=morning-after-pill-levonelle-01
//https://async.doctorcareanywhere.com/prototype/consultation-new.html?route=morning-after-pill-future-use-01


angular.module('synergixPrototypeApp.PageController', []).controller('PageController', function ($scope,$http,$interval) {
	$scope.questionStack = []; // the stack of questions straight from the JSON file
	$scope.questionOptions = [];
	$scope.jsonFile = "";
	$scope.arrayOfJSONfiles = [];
	$scope.arrayOfQuestionDivs; // collect all the DIVs with question class
	$scope.stageNum = document.getElementById("stageNum");// for the span in the H1 for the stage number
	$scope.totalStagesNum = document.getElementById("totalStagesNum");// for the span in the H1 for the total number of stages
	$scope.assessmentHeader = [];
	$scope.questionBlock = document.getElementById("questionBlock");// for the DIV that holds all the questions
	$scope.intermediatePages = document.getElementById("intermediatePages");// for the DIV that holds all the intermediate Pages
	$scope.outcomeDisplay = document.getElementById("outcomeDisplay");// for the DIV that holds all the problem questions for the outcome display
	$scope.bottomNav = document.getElementById("bottomNav");// for the DIV that holds the bottom navigation buttons
	$scope.backButtonObj = document.getElementById("backButton");// for the Back button
	$scope.flaggedHeader = document.getElementById("flaggedHeader");// for the flagged Header
	$scope.routeIdent; // Route identifier
	$scope.iOffsetObj = [{"offset": "0"},{"offset": ""},{"offset": ""},{"offset": ""},{"offset": ""}]; // Save the offset of each JSON file as it is loaded
	$scope.BMI = [{"metricWeight":0},{"metricHeight":0},{"stonesWeight":0}, {"poundsWeight":0},{"feetHeight":0},{"inchesHeight":0},{"BMI":0}];
	$scope.answersObj = []; // Create an array object for all the answer data, a nominal three rows.
	for(var p = 0; p < 3; p++) {
		$scope.answersObj.push({
			id: "",
			state: null,
			hidden: null,
			value: "",
			question: "",
			inputType: ""
		});
	}
	$scope.outcomeObj = [];
	$scope.inputChange;
	$scope.smallObj = document.querySelector('.steps small');
	$scope.debug = false; // debug feature

	// Load up assement header JSON file
	$scope.loadAssessmentHeader = function(route){
		$http.get('data/assessment-header.json').success(function(data){
			$scope.assessmentHeader = data; // this loads assessment header txt
			$interval($scope.getHeaderText, 250, 1); // inserting assessment text
		}).error(function(data){
			console.log("Error!! loadAssessmentHeader " + data);
		});
	};

	// Load up the relevant JSON file
	$scope.loadData = function(route,stage){
		$scope.totalStagesNum.innerHTML = $scope.arrayOfJSONfiles.length;
		$scope.jsonFile = 'data/' + $scope.arrayOfJSONfiles[stage-1] + '.json';

		// make an AJAX call to the JSON file holding all the questions and relevant info
		$http.get($scope.jsonFile).success(function(data){
				$scope.questionStack = data; // this populates the page via Angular ng-repeat
				$scope.iOffsetObj[stage].offset = data.length;// Save the offset of each JSON file as it is loaded

				$interval($scope.stageTidyUp, 250, 1); // Load several functions including one to stop non-number input into number only inputs
			}).error(function(data){
				console.log("Error!! " + data);
			});
	};

	// Test to see if first stage
	$scope.loadRoute = function(route){
		if (!route || route == 'erectile-dysfunction-01') {
			route = 'erectile-dysfunction-01'; // default value
			$scope.arrayOfJSONfiles = ['erectile-dysfunction-01','erectile-dysfunction-02','erectile-dysfunction-03','erectile-dysfunction-04'];
			$scope.routeIdent = "E-D";
		}
		else if (route == 'erectile-dysfunction-recommend-01') {
			$scope.arrayOfJSONfiles = ['erectile-dysfunction-recommend-01','erectile-dysfunction-recommend-02','erectile-dysfunction-recommend-03','erectile-dysfunction-recommend-04'];
			$scope.routeIdent = "E-D-R";
		}
		else if (route == 'chlamydia-treatment-01') {
			$scope.arrayOfJSONfiles = ['chlamydia-treatment-01','chlamydia-treatment-02','chlamydia-treatment-03'];
			$scope.routeIdent = "Chl";
		}
		else if (route == 'contraceptive-pill-3month-01') {
			$scope.arrayOfJSONfiles = ['contraceptive-pill-01','contraceptive-pill-02','contraceptive-pill-03','contraceptive-pill-04'];
			$scope.routeIdent = "C-P-3";
		}
		else if (route == 'contraceptive-pill-6month-01') {
			$scope.arrayOfJSONfiles = ['contraceptive-pill-01','contraceptive-pill-02','contraceptive-pill-03','contraceptive-pill-04'];
			$scope.routeIdent = "C-P-6";
		}
		else if (route == 'hair-loss-01') {
			$scope.arrayOfJSONfiles = ['hair-loss-01','hair-loss-02','hair-loss-03'];
			$scope.routeIdent = "H-L";
		}
		else if (route == 'genital-herpes-01') {
			$scope.arrayOfJSONfiles = ['genital-herpes-01','genital-herpes-02','genital-herpes-03'];
			$scope.routeIdent = "Herpes";
		}
		else if (route == 'genital-herpes-suppression-01') {
			$scope.arrayOfJSONfiles = ['genital-herpes-suppression-01','genital-herpes-suppression-02','genital-herpes-suppression-03'];
			$scope.routeIdent = "He-Su";
		}
		else if (route == 'morning-after-pill-ellaone-01') {
			$scope.arrayOfJSONfiles = ['morning-after-pill-ellaone-01','morning-after-pill-ellaone-02','morning-after-pill-ellaone-03'];
			$scope.routeIdent = "M-A-P-E-O";
		}
		else if (route == 'morning-after-pill-levonelle-01') {
			$scope.arrayOfJSONfiles = ['morning-after-pill-levonelle-01','morning-after-pill-levonelle-02','morning-after-pill-levonelle-03'];
			$scope.routeIdent = "M-A-P-L";
		}
		else if (route == 'morning-after-pill-future-use-01') {
			$scope.arrayOfJSONfiles = ['morning-after-pill-future-use-01'];
			$scope.routeIdent = "M-A-P-F-U";
		}

		var firstStageOnly = route.indexOf('-01');
		if (firstStageOnly == -1) {
			console.log("Not first stage - reject");//!!
			return false;
		}
		else {
			$scope.loadData(route,1); // Call the first stage
			$scope.loadAssessmentHeader(route); // Call the assessment header text
		}
		return true;
	};
	// pick up the name of the route/JSON filename from the parameter in the URL
	var route = getParameterByName('route');
	$scope.loadRoute(route);


	// insert bespoke header copy from JSON file based on route ID
	$scope.getHeaderText = function() {
		var assessmentHeaderObj = document.querySelectorAll('.title.assessmentHeader');
		var assessmentMessageObj = document.querySelector('.assessmentMsg');
		if (assessmentHeaderObj && assessmentMessageObj) {
			for (var a = 0, lengthA = $scope.assessmentHeader.length; a < lengthA; a++) {
				if ($scope.assessmentHeader[a].assessmentId == $scope.routeIdent){
					//console.log("assessmentHeaderObj.length=" + assessmentHeaderObj.length);//!!
					for (var b = 0, lengthB = assessmentHeaderObj.length; b < lengthB; b++) {
						assessmentHeaderObj[b].innerHTML = $scope.assessmentHeader[a].headline;
					}
					assessmentMessageObj.innerHTML = $scope.assessmentHeader[a].timeline;
				}
			}
			var n = parseInt($scope.stageNum.innerHTML,10); // What is the current stage?
			$scope.smallObj.innerHTML = "Step " + n  + " of " +  $scope.totalStagesNum.innerHTML;
		}
	};

	// getImagePath - To enable one to customise the image path easily and to put in a default image if a question specific one is missing
	$scope.getImagePath = function(imageName) {
		if (typeof imageName == 'undefined') {
			return "assets/images/1x1.gif";
		}
		else if (imageName === null) {
			return "assets/images/1x1.gif";
		}
		else if (imageName == "default") {
			return "assets/images/default.gif";
		} else {
			return "assets/images/" + imageName;
		}
	};

	// getIntermediatePartial - Pull in the relevant intermediate page partial for the selection treatment route.
	$scope.getIntermediatePartial = function() {
		var ipHTML;
		if ($scope.routeIdent == "E-D") {
			ipHTML = "partials/intermediate-erectile-dysfunction.html";
		}
		else if ($scope.routeIdent == "E-D-R") {
			ipHTML = "partials/intermediate-erectile-dysfunction-recommend.html";
		}
		else if ($scope.routeIdent == "Chl") {
			ipHTML = "partials/intermediate-chlamydia.html";
		}
		else if ($scope.routeIdent == "C-P-3") {
			ipHTML = "partials/intermediate-contraceptive-pill-3month.html";
		}
		else if ($scope.routeIdent == "C-P-6") {
			ipHTML = "partials/intermediate-contraceptive-pill-6month.html";
		}
		else if ($scope.routeIdent == 'H-L') {
			ipHTML = "partials/intermediate-hair-loss.html";
		}
		else if ($scope.routeIdent == 'Herpes') {
			ipHTML = "partials/intermediate-herpes.html";
		}
		else if ($scope.routeIdent == 'He-Su') {
			ipHTML = "partials/intermediate-herpes-suppression.html";
		}
		else if ($scope.routeIdent == "M-A-P-E-O") {
			ipHTML = "partials/intermediate-morning-after-pill-ellaone.html";
		}
		else if ($scope.routeIdent == "M-A-P-L") {
			ipHTML = "partials/intermediate-morning-after-pill-levonelle.html";
		}
		else if ($scope.routeIdent == 'M-A-P-F-U') {
			ipHTML = "partials/intermediate-morning-after-pill-future-use.html";
		}
		else {
			console.log("unknown intermediate partial!!  $scope.routeIdent=" + $scope.routeIdent);
			ipHTML = false;
		}
		return ipHTML;
	};


	// getQuesType - What type of question is it? Pull in the relevant partial, give it the options for the dropdown if necessary.
	$scope.getQuesType = function(qType,optionsStack) {
		var qHTML;
		if (qType == "radios") {
			qHTML = "partials/radio.html";
		}
		else if (qType == "radiosReact") {
			qHTML = "partials/radio-with-consequence.html";
		}
		else if (qType == "radiosReact2") {
			qHTML = "partials/radio-with-2-consequences.html";
		}
		else if (qType == "selectbox") {
			qHTML = "partials/dropdown.html";
		}
		else if (qType == "height") {
			qHTML = "partials/height-selector.html";
		}
		else if (qType == "weight") {
			qHTML = "partials/weight-selector.html";
		}
		else if (qType == "textbox" || qType == "textboxWithLink") {
			qHTML = "partials/textbox.html";
		}
		else if (qType == "checkbox" || qType == "checkboxTerms") {
			qHTML = "partials/checkbox.html";
		}
		else if (qType == "checkboxMultiple") {
			qHTML = "partials/checkbox-multiple.html";
		}
		else if (qType == "upload") {
			qHTML = "partials/upload.html";
		}
		else if (qType == "date") {
			qHTML = "partials/date.html";
		}
		else if (qType == "bmi") {
			qHTML = "partials/bmi.html";
		}
		else if (qType == "combi") {
			qHTML = "partials/combi.html";
		}
		else {
			console.log("Unknown question type !!");
			qHTML = false;
		}
		return qHTML;
	};


	// getQuestion - What is the question on the left? Might need modifying or the checkbox or with picture.
	$scope.getQuestion = function(qType) {
		var qHTML;
		if (qType == "checkboxTerms") {
			qHTML = "partials/checkbox-terms.html";
		}
		else if (qType == "textboxWithLink") {
			qHTML = "partials/question-with-link.html";
		}
		else if (qType == "bmi" || qType == "combi") {
			qHTML = "partials/hidden-question.html";
		}
		else {
			qHTML = "partials/question.html";
		}
		return qHTML;
	};


	// whichNumberInput - the height and weight widgets have two sets of number inputs, metric and imperial.
	// At any one time one set will be hidden, we want the value of the set that is visible.
	$scope.whichNumberInput = function(questionDivObj){

		var arrayNumberBlocks = questionDivObj.querySelectorAll('div.numberBlock');

		for (var i = 0, len = arrayNumberBlocks.length; i < len; i++) {
			var metricHeightInput = arrayNumberBlocks[i].querySelector(".metricHeight");
			var metricWeightInput = arrayNumberBlocks[i].querySelector(".metricWeight");

			if (metricHeightInput){
				return $scope.BMI.metricHeight;
			}
			else if (metricWeightInput){
				return $scope.BMI.metricWeight;
			}
		}
		return false;
	};

	// calcOffset - offset between the large question array and the subset of questions present on screen
	$scope.calcOffset = function() {
		var iOffset = 0,
			n = parseInt($scope.stageNum.innerHTML,10); // What is the current stage?

		while (n >= 1) { // loop down through the stages
			iOffset += parseInt($scope.iOffsetObj[n-1].offset,10); // take from iOffsetObj the relevant offset, add it to the running total
			n--;
		}
		return iOffset;
	};






	// DO NOT DELETE - USEFUL UTILITY TO ITERATIVELY EXAMINE A JS DATA OBJECT
	$scope.objInspection = function() {
		console.log("================= objInspection of $scope.answersObj ==================");
		for (var key in $scope.answersObj) {
			if ($scope.answersObj.hasOwnProperty(key)) {
				console.log(key + " -> " + $scope.answersObj[key]);
				for (var keyA in $scope.answersObj[key]) {
					if ($scope.answersObj[key].hasOwnProperty(keyA)) {
						if (typeof($scope.answersObj[key][keyA]) === 'object') {
							//$scope.objInspect($scope.answersObj[key][keyA],"$scope.answersObj[key][keyA]");
							console.log("~~ " + keyA + " ->  object!");
						}
						else {console.log("~~ " + keyA + " -> " + $scope.answersObj[key][keyA]);}
					}
				}
			}
		}
	};

	$scope.objInspect = function(theObject,theObjectName,depth) {
		console.log("===== objInspect of " + theObjectName + " =======");
		for (var key in theObject) {
			if (theObject.hasOwnProperty(key)) {
				console.log(key + " -> " + theObject[key]);
				if (depth > 1) {
					for (var keyA in theObject[key]) {
						if (theObject[key].hasOwnProperty(keyA)) {
							console.log("## " + keyA + " -> " + theObject[key][keyA]);
						}
					}
				}
			}
		}
	};


	// Make a judgement re moving on to next stage
	$scope.judgement = function(){
		window.scrollTo(0,0); // scroll to top of page
		var goFlag = true; // set to false if there are still required questions flagged
		for (var m = 0, lenM = $scope.arrayOfQuestionDivs.length; m < lenM; m++) {
			var state = null,
				hidden = null,
				value = null,
				inputType = null;

			// Collect a value from one of the various question types
			if (!hasClass($scope.arrayOfQuestionDivs[m],"hide")){
				hidden = false;
				if ($scope.arrayOfQuestionDivs[m].querySelector('input.combi')) {
					value = $scope.arrayOfQuestionDivs[m].querySelector('input[type="hidden"]').value;
					//console.log("combi bmi value=" + value);//!!
					inputType = "combi";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('input[type="hidden"]')) {
					value = $scope.arrayOfQuestionDivs[m].querySelector('input[type="hidden"]').value;
					inputType = "bmi";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('input[type="number"]')) {
					value = $scope.whichNumberInput($scope.arrayOfQuestionDivs[m]);
					//console.log("number value=" + value);
					inputType = "number";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('input[type="file"]')) {
					value = $scope.arrayOfQuestionDivs[m].querySelector('input[type="file"]').value;
					value = value.replace("C:","");
					value = value.replace("fakepath","");
					value = value.replace(/\\/g, "");
					inputType = "file";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('input[type="date"]')) {
					value = $scope.arrayOfQuestionDivs[m].querySelector('input[type="date"]').value;
					inputType = "date";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('input[type="radio"]:checked')) {
					value = $scope.arrayOfQuestionDivs[m].querySelector('input[type="radio"]:checked').value;
					inputType = "radio";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('input[type="checkbox"]:checked')) {
					var checkboxArray = $scope.arrayOfQuestionDivs[m].querySelectorAll('input[type="checkbox"]:checked');
					// Multiple checkboxes need a complex object to save their answers to
					if (checkboxArray.length > 1) {
						var checkboxArrayAnswers = [];
						for (var z = 0, lengthZ = checkboxArray.length; z < lengthZ; z++) {
							checkboxArrayAnswers.push({subID:checkboxArray[z].id, subValue:checkboxArray[z].value});
						}
						value = checkboxArrayAnswers;
					}
					else {
						value = "yes"; // value/answer for a single checkbox
					}
					inputType = "checkbox";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('select')) {
					var sel = $scope.arrayOfQuestionDivs[m].querySelector('select'); // put the select tag into an object called sel
					//var selectedAnswer = $scope.arrayOfQuestionDivs[m].querySelector('select').value;
					var selectedAnswer = sel.options[sel.selectedIndex].text;
					var selectedIndex = $scope.arrayOfQuestionDivs[m].querySelector('select').selectedIndex;
					if (selectedIndex > 0) {
						var selectAnswerObj = {selectedIndex:selectedIndex, subValue:selectedAnswer};
						value = selectAnswerObj;
					}
					inputType = "select";
				}
				else if ($scope.arrayOfQuestionDivs[m].querySelector('textarea')) {
					value = $scope.arrayOfQuestionDivs[m].querySelector('textarea').value;
					inputType = "textarea";
				}
			}
			else {
				value = null;
				hidden = true;
			}

			if (value) { // if a legitimate answer, set state to true = question has been answered
				state = true;
			}
			n = m + $scope.calcOffset(); // what is the offset at present?

			var dataEntry = {
				id: $scope.arrayOfQuestionDivs[m].id,
				state: state,
				hidden: hidden,
				value: value,
				question: $scope.arrayOfQuestionDivs[m].getElementsByTagName('label')[0].textContent.trim(),
				inputType: inputType
			};
			// fill up the answersObject with answers/details.
			if ($scope.answersObj[n]) {
				$scope.answersObj[n] = dataEntry;
			}
			else { // if the numbered entry does not exist, create it.
				$scope.answersObj.push(dataEntry);
			}
		}

		//$scope.objInspection();//temp!! within judgement()


		goFlag = true;
		// For each flag in the object array, judge on whether to give green tick, or whether to set required flag
		for (var i = 0, len = $scope.arrayOfQuestionDivs.length; i < len; i++) {
			var j = i + $scope.calcOffset(); // what is the offset at present?
			var requiredObj = $scope.arrayOfQuestionDivs[i].querySelectorAll("span.requireClass")[0]; // find the span with the "Required" text in it.
			var greenTickObj = $scope.arrayOfQuestionDivs[i].querySelectorAll("span.-has-success")[0]; // find the span with the "-has-success" class.

			if ($scope.answersObj[j] && $scope.answersObj[j].hidden === false) {
				if ($scope.answersObj[j].state === true) {// Set to true mode = tick
					removeClass($scope.arrayOfQuestionDivs[i],"has-error");
					addClass(requiredObj,"hide");
					removeClass(requiredObj,"required");
					removeClass(greenTickObj,"hide");
				}
				else if ($scope.answersObj[j].state === false || $scope.answersObj[j].state === null) {// Set to false/required mode
					addClass($scope.arrayOfQuestionDivs[i],"has-error");
					removeClass(requiredObj,"hide");
					addClass(requiredObj,"required");
					goFlag = false;
					addClass(greenTickObj,"hide");
				}
				else {
					alert($scope.answersObj[j].state);
				}
			}
		}


		// Go through arrayOfJSONfiles to find next JSON file name and load it
		for (var l = 0, lengthL = $scope.arrayOfJSONfiles.length; l < len; l++) {
			//console.log(l + "   file= " + $scope.arrayOfJSONfiles[l]);//!!
			var finder = $scope.jsonFile.indexOf($scope.arrayOfJSONfiles[l]);
			var currentStage = -1;
			if (finder > 0 && goFlag) {
				currentStage = l + 2;
				$scope.stageNum.innerHTML = currentStage;
				$scope.smallObj.innerHTML = "Step " + currentStage + " of " +  $scope.totalStagesNum.innerHTML;


				// hide or reveal back button dependent on stage number
				if (currentStage > 1) {
					removeClass($scope.backButtonObj,"hide");
				}
				else if (currentStage == 1) {
					addClass($scope.backButtonObj,"hide");
				}

				// Go to next stage if json file exists or go to outcome page
				if (l < lengthL - 1) {
					$scope.loadData($scope.arrayOfJSONfiles[l + 1], currentStage);

					// Has this stage been done already? If yes, load up the previous answers.
					$interval($scope.loadDataFromObj, 500, 1);
				}
				else {
					//$scope.objInspection();//temp!! just before setOutcome()
					$scope.setOutcome();
				}
				break;
			}
			else {console.log("rejected");}
		}
	};

	// set the series of flags for outcomes B, C and D dependent on treatment chosen
	$scope.setOutcome = function(){
		var outcomeBArray = [],
			outcomeCArray = [],
			outcomeDArray = [],
			outcomeAObj = [];

		// Load array of answers that effect an outcome for a specific path
		if ($scope.routeIdent == "Chl") { // if path is Chlamydia treatment
			outcomeBArray = [
				{QID:"Q1",ans:["4"]},
				{QID:"Q3",ans:"yes"},
				{QID:"Q3.1",ans:true},
				{QID:"Q4",ans:"yes"},
				{QID:"Q4.1",ans:true},
				{QID:"Q5",ans:"yes"},
				{QID:"Q5.1",ans:true},
				{QID:"Q6",ans:"yes"},
				{QID:"Q6.1",ans:true}
			];
			outcomeCArray = [
				{QID:"Q1",ans:["3","5"]},
				{QID:"Q1.1",ans: true},
				{QID:"Q2",ans:["Q2-3","Q2-5","Q2-6","Q2-7","Q2-8"]}
			];
			outcomeDArray = [
				{QID:"Q7",ans:"yes"},
				{QID:"Q7.1",ans: true}
			];
		}
		else if ($scope.routeIdent == "C-P-3" || $scope.routeIdent == "C-P-6") { // if path is Contraceptive Pill
			outcomeBArray = [
				{QID:"Q2",ans:"yes"},
				{QID:"Q2.1",ans: true},
				{QID:"Q3",ans:"yes"},
				{QID:"Q3.1",ans: true},
				{QID:"Q4",ans:"yes"},
				{QID:"Q4.1",ans: true},
				{QID:"Q10",ans:"yes"},
				{QID:"Q10.1",ans: true},
				{QID:"Q12",ans:"yes"},
				{QID:"Q12.1",ans: true},
				{QID:"Q13",ans:"yes"},
				{QID:"Q13.1",ans: true},
				{QID:"Q14",ans:"yes"},
				{QID:"Q14.1",ans: true},
				{QID:"Q15",ans:["1"]},
				{QID:"Q15.1",ans:"1"},
				{QID:"Q17",ans:"yes"},
				{QID:"Q17.1",ans:true}
			];
			outcomeCArray = [
				{QID:"Q1.2",ans:"no"},
				{QID:"Q7",ans:"yes"},
				{QID:"Q7.1",ans: true},
				{QID:"Q8",ans:"yes"},
				{QID:"Q8.1",ans: true},
				{QID:"Q9",ans:"yes"},
				{QID:"Q9.1",ans: true},
				{QID:"Q11",ans:"yes"},
				{QID:"Q11.1",ans: true},
				{QID:"Q16",ans:"no"},
				{QID:"Q16.1",ans:"1"},
				{QID:"Q16.2",ans:true}
			];
			outcomeDArray = [
				{QID:"Q18",ans:"yes"},
				{QID:"Q18.1",ans: true},
				{QID:"Q19",ans:"yes"},
				{QID:"Q19.1",ans: true},
				{QID:"Q23",ans: {"bmi":"35","weight":"999"}}, // flag if BMI above 35, we don't have a weight setting, therefore a nominal 999
				{QID:"Q24",ans: {"bmi":"30","combiQ":"Q15","combiQAns":"yes"}}
			];
		}
		else if ($scope.routeIdent == "E-D") {// if path is Erectile Dysfunction
			outcomeBArray = [
				{QID:"Q4",ans:"yes"},
				{QID:"Q4.1",ans: true},
				{QID:"Q8",ans:"yes"},
				{QID:"Q9",ans:"yes"},
				{QID:"Q9.1",ans: true},
				{QID:"Q12",ans:"yes"},
				{QID:"Q12.1",ans: true},
				{QID:"Q25",ans:"yes"},
				{QID:"Q25.1",ans: true}
			];
			outcomeCArray = [
				{QID:"Q1",ans:"yes"},
				{QID:"Q10",ans: "yes"},
				{QID:"Q10.1",ans: true},
				{QID:"Q13",ans:"yes"},
				{QID:"Q13.1",ans: true},
				{QID:"Q15",ans:"yes"},
				{QID:"Q16",ans: "yes"},
				{QID:"Q17",ans:"yes"},
				{QID:"Q17.1",ans: true},
				{QID:"Q18",ans:"yes"},
				{QID:"Q18.1",ans: ["1","2","3","4"]},
				{QID:"Q19",ans:"yes"},
				{QID:"Q19.1",ans: true},
				{QID:"Q21",ans:"yes"},
				{QID:"Q21.1",ans: true},
				{QID:"Q22",ans:"yes"},
				{QID:"Q22.1",ans: true},
				{QID:"Q24",ans:"yes"},
				{QID:"Q24.1",ans: true}
			];
			outcomeDArray = [
				{QID:"Q11",ans:"yes"},
				{QID:"Q11.1",ans: true},
				{QID:"Q14",ans:"yes"},
				{QID:"Q14.1",ans: true},
				{QID:"Q20",ans:"yes"},
				{QID:"Q20.1",ans: true},
				{QID:"Q23",ans:"yes"},
				{QID:"Q23.1",ans: true}
			];
		}
		else if ($scope.routeIdent == "E-D-R") {// if path is Erectile Dysfunction Repression
			outcomeBArray = [
				{QID:"Q4",ans:"yes"},
				{QID:"Q4.1",ans: true},
				{QID:"Q8",ans:"yes"},
				{QID:"Q9",ans:"yes"},
				{QID:"Q9.1",ans: true},
				{QID:"Q12",ans:"yes"},
				{QID:"Q12.1",ans: true},
				{QID:"Q25",ans:"yes"},
				{QID:"Q25.1",ans: true}
			];
			outcomeCArray = [
				{QID:"Q1",ans:"yes"},
				{QID:"Q13",ans:"yes"},
				{QID:"Q13.1",ans: true},
				{QID:"Q17",ans:"yes"},
				{QID:"Q17.1",ans: true},
				{QID:"Q18",ans:"yes"},
				{QID:"Q18.1",ans: ["1","2","3","4"]},
				{QID:"Q19",ans:"yes"},
				{QID:"Q19.1",ans: true},
				{QID:"Q21",ans:"yes"},
				{QID:"Q21.1",ans: true},
				{QID:"Q22",ans:"yes"},
				{QID:"Q22.1",ans: true}
			];
			outcomeDArray = [
				{QID:"Q11",ans:"yes"},
				{QID:"Q11.1",ans: true},
				{QID:"Q14",ans:"yes"},
				{QID:"Q14.1",ans: true},
				{QID:"Q20",ans:"yes"},
				{QID:"Q20.1",ans: true},
				{QID:"Q23",ans:"yes"},
				{QID:"Q23.1",ans: true}
			];
		}
		else if ($scope.routeIdent == "H-L") { // if path is Hair Loss
			outcomeBArray = [
				{QID:"Q1",ans:["1"]},
				{QID:"Q2",ans:["1"]},
				{QID:"Q6",ans:"yes"},
				{QID:"Q6.1",ans:true},
				{QID:"Q7",ans:"yes"},
				{QID:"Q7.1",ans:true},
				{QID:"Q9",ans:"yes"},
				{QID:"Q9.1",ans:true},
				{QID:"Q10",ans:"yes"},
				{QID:"Q10.1",ans:true},
				{QID:"Q11",ans:"yes"},
				{QID:"Q11.1",ans:true},
				{QID:"Q12",ans:"yes"},
				{QID:"Q12.1",ans:true},
				{QID:"Q13",ans:"yes"},
				{QID:"Q13.1",ans:true}
			];
			outcomeCArray = [
				{QID:"Q1",ans:["6"]},
				{QID:"Q1.1",ans: true}, /* pic filename */
				{QID:"Q3",ans:["1"]},
				{QID:"Q3.1",ans:true},
				{QID:"Q4",ans:"yes"},
				{QID:"Q4.1",ans:true},
				{QID:"Q5",ans:["3"]},
				{QID:"Q6",ans:"no"},
				{QID:"Q14",ans:"no"}
			];
			outcomeDArray = [
				{QID:"Q8",ans:"yes"},
				{QID:"Q8.1",ans: true}
			];
		}
		else if ($scope.routeIdent == "Herpes") { // if path is Herpes Acute
			outcomeBArray = [
				{QID:"Q2",ans:["1"]},
				{QID:"Q3",ans: true},
				{QID:"Q3.1",ans:true},
				{QID:"Q7",ans:"yes"},
				{QID:"Q7.1",ans: true},
				{QID:"Q8",ans:"yes"},
				{QID:"Q8.1",ans: true}

			];
			outcomeCArray = [
				{QID:"Q1",ans:["3"]},
				{QID:"Q1.1",ans: true}, /* pic filename */
				{QID:"Q2",ans:["2"]},
				{QID:"Q3",ans: "no"},
				{QID:"Q4",ans:["1","3"]},
				{QID:"Q4.1",ans: true},
				{QID:"Q5",ans:"yes"},
				{QID:"Q5.1",ans: true},
				{QID:"Q6",ans:"yes"},
				{QID:"Q6.1",ans: true},
				{QID:"Q9",ans:"yes"},
				{QID:"Q9.1",ans: true},
				{QID:"Q10",ans:"yes"},
				{QID:"Q10.1",ans: true}
			];
			outcomeDArray = []; // deliberately empty
		}
		else if ($scope.routeIdent == "He-Su") { // if path is Herpes suppression
			outcomeBArray = [
				{QID:"Q2",ans:["1"]},
				{QID:"Q2.1",ans: true},
				{QID:"Q3",ans: "yes"},
				{QID:"Q3.1",ans:true},
				{QID:"Q7",ans:"yes"},
				{QID:"Q7.1",ans: true},
				{QID:"Q8",ans:"yes"},
				{QID:"Q8.1",ans: true}

			];
			outcomeCArray = [
				{QID:"Q1",ans:["3"]},
				{QID:"Q1.1",ans: true},
				{QID:"Q3",ans: "no"},
				{QID:"Q4",ans:["1","3"]},
				{QID:"Q4.1",ans: true},
				{QID:"Q5",ans:"yes"},
				{QID:"Q5.1",ans: true},
				{QID:"Q6",ans:"yes"},
				{QID:"Q6.1",ans: true},
				{QID:"Q9",ans:"yes"},
				{QID:"Q9.1",ans: true},
				{QID:"Q10",ans:"yes"},
				{QID:"Q10.1",ans: true}
			];
			outcomeDArray = []; // deliberately empty
		}
		else if ($scope.routeIdent == "M-A-P-E-O") { // if path is Morning After Pill Ella One
			outcomeBArray = [
				{QID:"Q1",ans:["1","4"]}, // answers 1 or 4 from this dropdown/select
				{QID:"Q1.1",ans: true},
				{QID:"Q2",ans:"yes"},
				{QID:"Q2.1",ans:true},
				{QID:"Q3",ans:true},
				{QID:"Q4",ans:true}, // any answer from this dropdown/select
				{QID:"Q7",ans:"yes"},
				{QID:"Q7.1",ans:true},
				{QID:"Q13",ans:"yes"},
				{QID:"Q13.1",ans:true},
				{QID:"Q14",ans:"yes"},
				{QID:"Q14.1",ans:true},
				{QID:"Q15",ans:"yes"},
				{QID:"Q15.1",ans:true}
			];
			outcomeCArray = [
				{QID:"Q5",ans:"yes"},
				{QID:"Q5.1",ans: true},
				{QID:"Q12",ans:"yes"},
				{QID:"Q12.1",ans: true},
				{QID:"Q19",ans: {"bmi":"30","weight":"85"}} // catch a BMI over 30 OR catch a weight over 85
			];
			outcomeDArray = [
				{QID:"Q8",ans:"yes"},
				{QID:"Q8.1",ans: true}
			];
		}
		else if ($scope.routeIdent == "M-A-P-L") { // if path is Morning After Pill Levonelle
			outcomeBArray = [
				{QID:"Q1",ans:["1","4"]},
				{QID:"Q1.1",ans: true},
				{QID:"Q2",ans:"yes"},
				{QID:"Q2.1",ans:true},
				{QID:"Q3",ans:true},
				{QID:"Q4",ans:true}, // any answer from this dropdown/select
				{QID:"Q7",ans:"yes"},
				{QID:"Q7.1",ans:true},
				{QID:"Q13",ans:"yes"},
				{QID:"Q13.1",ans:true},
				{QID:"Q14",ans:"yes"},
				{QID:"Q14.1",ans:true},
				{QID:"Q15",ans:"yes"},
				{QID:"Q15.1",ans:true}
			];
			outcomeCArray = [
				{QID:"Q5",ans:"yes"},
				{QID:"Q5.1",ans: true},
				{QID:"Q8",ans:"yes"},
				{QID:"Q8.1",ans: true},
				{QID:"Q19",ans: {"bmi":"26","weight":"70"}} // catch a BMI over 26 OR catch a weight over 70
			];
			outcomeDArray = []; // deliberately empty
		}
		else if ($scope.routeIdent == "M-A-P-F-U") { // if path is Morning After Pill Future Use
			outcomeBArray = [
				{QID:"Q2",ans:"yes"},
				{QID:"Q2.1",ans:true},
				{QID:"Q3",ans:"yes"},
				{QID:"Q3.1",ans:true},
				{QID:"Q4",ans:"yes"},
				{QID:"Q4.1",ans:true},
				{QID:"Q5",ans:"yes"},
				{QID:"Q5.1",ans:true}
			];
			outcomeCArray = [
				{QID:"Q1",ans:["2","3"]},
				{QID:"Q1.1",ans: true},
				{QID:"Q9",ans:"yes"},
				{QID:"Q12",ans: {"bmi":"26","weight":"70"}}, // catch for the patient's BMI was too high for Levonelle
				{QID:"Q13",ans: {"bmi":"30","weight":"85"}} // catch for the patient's BMI was too high for EllaOne
			];
			outcomeDArray = []; // deliberately empty

		}

		// Test for a D outcome
		var outcomeDResults = $scope.compareAnswers(outcomeDArray,"D");
		// Test for a C outcome
		var outcomeCResults = $scope.compareAnswers(outcomeCArray,"C");
		// Test for a B outcome
		var outcomeBResults = $scope.compareAnswers(outcomeBArray,"B");


		// Show D outcome
		if (outcomeDResults.flag) {
			$scope.displayOutcome(outcomeDResults.answers,"D");
		}
		// Show C outcome
		else if (outcomeCResults.flag) {
			$scope.displayOutcome(outcomeCResults.answers,"C");
		}
		// Show B outcome
		else if (outcomeBResults.flag) {
			$scope.displayOutcome(outcomeBResults.answers,"B");
		}
		else{ // Show A outcome
			$scope.displayOutcome(outcomeAObj,"A");
		}
	};

	// compare user's answers with the flags set for the C, B, & D outcomes by the doctors
	$scope.compareAnswers = function(outcomeArray,outcomeLetter){
		var outcomeFlag = false;
			outcomeObj = [];
		for (var i = 0, leng = outcomeArray.length; i < leng; i++) {
			var id = outcomeArray[i].QID + "ID";
			for (var j = 0, len = $scope.answersObj.length; j < len; j++) {
				if ((id == $scope.answersObj[j].id) && ($scope.answersObj[j].value !== null)){

					// Test for dropdowns and checkboxes which have answers that are complex objects
					if (typeof($scope.answersObj[j].value) === 'object'){
						interimValueObj = $scope.answersObj[j].value;
						interimAnswerObj = outcomeArray[i].ans;

						if ($scope.answersObj[j].inputType == "select") {
							if (interimAnswerObj === true) { // simple answer wanted
								outcomeFlag = true;
								outcomeObj.push({
									id:outcomeArray[i].QID,
									question:$scope.answersObj[j].question,
									value:$scope.answersObj[j].value.subValue
								});
								break;
							}
							else {
								for (var k = 0, lengt = interimAnswerObj.length; k < lengt; k++) {
									if (interimValueObj.selectedIndex == interimAnswerObj[k]){
										outcomeFlag = true;
										outcomeObj.push({
											id:outcomeArray[i].QID,
											question:$scope.answersObj[j].question,
											value:$scope.answersObj[j].value.subValue
										});
										break;
									}
								}
							}
						}

						else if ($scope.answersObj[j].inputType == "checkbox") {
							for (var c = 0, lengthC = interimAnswerObj.length; c < lengthC; c++) {
								for (var l = 0, lengthL = interimValueObj.length; l < lengthL; l++) {
									if (interimValueObj[l].subID == interimAnswerObj[c]){
										outcomeFlag = true;
										outcomeObj.push({
											id:interimValueObj[l].subID,
											question:$scope.answersObj[j].question,
											value:interimValueObj[l].subValue
										});
										break;
									}
								}
							}
						}
						else {
							console.log("Complex answer object but not select or checkbox - inputType = " +$scope.answersObj[j].inputType);
						}
					}
					/*else if ($scope.answersObj[j].inputType == "date") {
						console.log("date=" + $scope.answersObj[j].value);
					}*/
					else if ($scope.answersObj[j].inputType == "combi") {
						var interimCombiPatientAnswerValue,
							interimCombiQuestion;
						// Find the combination question
						for (var m = 0, lengthM = $scope.answersObj.length; m < lengthM; m++) {
							if (outcomeArray[i].ans.combiQ + "ID" == $scope.answersObj[m].id) {
								interimCombiPatientAnswerValue = $scope.answersObj[m].value.subValue;
								interimCombiQuestion = $scope.answersObj[m].question;
								break;
							}
						}
						// If the patient's BMI is higher than the value set in outcomeArray[i].ans, PLUS...
						if ($scope.answersObj[j].value > outcomeArray[i].ans.bmi && interimCombiPatientAnswerValue.toLowerCase() == outcomeArray[i].ans.combiQAns.toLowerCase()){
							outcomeFlag = true;
							outcomeObj.push({
								id:outcomeArray[i].QID,
								question:$scope.answersObj[j].question + " " + interimCombiQuestion + " Answered - " + interimCombiPatientAnswerValue,
								value:$scope.answersObj[j].value.subValue
							});
							//console.log("combi $scope.answersObj[j].value.subValue=" + $scope.answersObj[j].value.subValue);//!!
						}
					}
					else if ($scope.answersObj[j].inputType == "bmi") {
						var interimPatientBMI = parseFloat($scope.answersObj[j].value).toFixed(2);

						// If the patient's BMI is higher than the value set in outcomeArray[i].ans OR the weight is too high
						if ($scope.answersObj[j].value > outcomeArray[i].ans.bmi || $scope.BMI.metricWeight > outcomeArray[i].ans.weight){
						//if ($scope.answersObj[j].value > outcomeArray[i].ans.bmi && $scope.BMI.metricWeight > outcomeArray[i].ans.weight){
							outcomeFlag = true;
							outcomeObj.push({
								id:outcomeArray[i].QID,
								question:$scope.answersObj[j].question + " with weight of " + $scope.BMI.metricWeight.toFixed(2) + "kg.",
								value: "BMI = " + interimPatientBMI
							});
						}
					}
					// Test for radio buttons or those with simple not complex object answers, such as a single checkbox
					else if (($scope.answersObj[j].value == outcomeArray[i].ans) || (outcomeArray[i].ans === true)) {
						outcomeFlag = true;
						outcomeObj.push({
							id:outcomeArray[i].QID,
							question:$scope.answersObj[j].question,
							value:$scope.answersObj[j].value
						});
						break;
					}
				}
			}
		}
		return {
			flag:outcomeFlag,
			answers:outcomeObj
		};
	};


	// displayOutcome - modify the H1, paragraph, content and styling, but still keep hidden till later
	$scope.displayOutcome = function(outcomeObj,outcome){
		console.log("outcome = " + outcome);//!!
		addClass($scope.questionBlock,'hide'); // hide the last stage of questions
		addClass($scope.bottomNav,'hide'); // hide the bottom navigation buttons on intermediate pages
		removeClass($scope.intermediatePages,'hide'); // reveal intermediate pages
		var headerText = document.getElementById('outcomeHeader');
		var outcomeText = document.getElementById('outcomeNextStep');
		var button2Text = document.getElementById('outcomeButton2');
		
		// set up a button to be clickable and to go to the telephone consultation
		setButton4Consultation = function(){
			if (button2Text) {
				button2Text.innerHTML = "Request consultation";
				var button2Obj = findAncestor(button2Text,"button2");
				button2Obj.setAttribute("onclick","confirmTreatment(true)");
				addClass(button2Obj,"active"); // make hover state
			};
		};
		
		if (outcome == "A"){
			headerText.innerHTML = "Prescription can be given with no further review";
			outcomeText.innerHTML = "Review and issue prescription.";
			button2Text.innerHTML = "Issue prescription";
			addClass($scope.outcomeDisplay,'outcomeA'); // style Outcome A page
			addClass($scope.flaggedHeader,'hide'); // hide Flagged Assessment Questions header
		}
		else if (outcome == "B"){
			headerText.innerHTML = "GP needs to review the assessment before issuing prescription";
			outcomeText.innerHTML = "Review flagged assessment questions before issuing prescription.";
			button2Text.innerHTML = "Issue prescription";
			addClass($scope.outcomeDisplay,'outcomeB'); // style Outcome B page
		}
		else if (outcome == "C"){
			headerText.innerHTML = "Patient may need a consultation before issuing prescription";
			outcomeText.innerHTML = "Review assessment - Virtual consultation may be required.";
			// set up a button to be clickable and to go to the telephone consultation
			//if (button2Text) {
//				button2Text.innerHTML = "Request consultation";
//				var button2Obj = findAncestor(button2Text,"button2");
//				button2Obj.setAttribute("onclick","confirmTreatment(true)");
//				addClass(button2Obj,"active");
//			};
			setButton4Consultation();
			addClass($scope.outcomeDisplay,'outcomeC'); // style Outcome C page
		}
		else if (outcome == "D"){
			headerText.innerHTML = "Consultation required before issuing prescription";
			outcomeText.innerHTML = "Recommend a virtual or in-person consultation.";
			//button2Text.innerHTML = "Request consultation";
			setButton4Consultation();
			addClass($scope.outcomeDisplay,'outcomeD'); // style Outcome D page
		}
		$scope.outcomeObj = outcomeObj; // Populate the display with the problem questions and answers - though still hidden
	};



	// Do some preparation of Imperial data before the BMI calculation
	$scope.imperialPrep = function(metricValue,type){
		var pounds = 0,
			stones = 0,
			inches = 0,
			feet = 0;
		if (type == "weight") {
			$scope.BMI.metricWeight = metricValue;
		}
		else if (type == "height") {
			$scope.BMI.metricHeight = metricValue ;
		}

		if ($scope.BMI.stonesWeight > 0 || $scope.BMI.poundsWeight > 0 ){
			// convert stones and pounds to kg, if the $scope value is null or undefined the local variable gets set to 0.
			stones = $scope.BMI.stonesWeight || 0;
			pounds = $scope.BMI.poundsWeight || 0;
			$scope.BMI.metricWeight = (stones + (pounds / 14)) * 6.35029;
		}

		if ($scope.BMI.feetHeight > 0 || $scope.BMI.inchesHeight > 0) {
			// convert feet and inches to centimetres
			feet = $scope.BMI.feetHeight || 0;
			inches = $scope.BMI.inchesHeight || 0;
			$scope.BMI.metricHeight = (feet + (inches / 12)) * 30.48;
		}
		//console.log("$scope.BMI.feetHeight = " + $scope.BMI.feetHeight + " $scope.BMI.inchesHeight = " + $scope.BMI.inchesHeight);//!!
		//console.log("$scope.BMI.stonesWeight = " + $scope.BMI.stonesWeight + " $scope.BMI.poundsWeight = " + $scope.BMI.poundsWeight);//!!

		$scope.bmiCalc();
	};

	// BMI calculator
	$scope.bmiCalc = function() {
		//console.log("$scope.BMI.metricHeight=" + $scope.BMI.metricHeight + "  $scope.BMI.metricWeight=" + $scope.BMI.metricWeight);//!!

		if ($scope.BMI.metricWeight > 0 && $scope.BMI.metricHeight > 0) {
			//To calculate your BMI, height in metres and weight in kilograms; then divide your weight by your height squared.
			$scope.BMI.BMI = $scope.BMI.metricWeight / (Math.pow(($scope.BMI.metricHeight/100), 2));
			console.log("$scope.BMI.BMI=" + $scope.BMI.BMI.toFixed(2));//!!
		}
	};


	// For the Height and Weight widgets/partials, the entry can be made in Metric or Imperial.
	// The metricSwitcher function switches between the different sets of inputs dependant on the radio button selection.
	$scope.metricSwitcher = function(flag){
		//$scope.imperialPrep();
		var imperialBlock;
		var metricBlock;
		// Is this function being called by the height widget or the weight widget?
		if (flag == "imperialBlockH" | flag == "metricBlockH") {
			imperialBlock = document.getElementById("imperialBlockH");
			metricBlock = document.getElementById("metricBlockH");
		}
		else if (flag == "imperialBlockW" | flag == "metricBlockW") {//weight widget
			imperialBlock = document.getElementById("imperialBlockW");
			metricBlock = document.getElementById("metricBlockW");
		}

		var subFlag = flag.indexOf('metric'); // Did they ask for the metric version?
		if (subFlag > -1) {//yes they did
			removeClass(metricBlock,'hide');
			addClass(imperialBlock,'hide');
			$scope.metricImperialConverter(flag,imperialBlock,metricBlock);
		}
		else {
			if (!hasClass(imperialBlock,'hide')){return false;} // Don't continue if the imperial block is already visible
			removeClass(imperialBlock,'hide');
			addClass(metricBlock,'hide');
			$scope.metricImperialConverter(flag,imperialBlock,metricBlock);
		}
		return true;
	};

	//metricImperialConverter - Convert from metric to imperial or reverse for weight or height
	$scope.metricImperialConverter = function(flag,imperialBlock,metricBlock){
		var metricValue = 0;
		var metricValueRounded = parseFloat(metricBlock.querySelector('input[type="number"]').value);
		var metricValueComplete = (metricBlock.querySelector('input[type="number"]').getAttribute("data-value"));
		if (metricValueRounded != parseFloat(metricValueComplete).toFixed(2)) {
			metricValue = metricValueRounded;
		}
		else {
			metricValue = parseFloat(metricValueComplete).toFixed(2);
		}

		var imperialValuePart1 = parseInt(imperialBlock.querySelectorAll('input[type="number"]')[0].value,10);
		var imperialValuePart2Complete = imperialBlock.querySelectorAll('input[type="number"]')[1].getAttribute("data-value");
		var imperialValuePart2Rnd = parseInt(imperialBlock.querySelectorAll('input[type="number"]')[1].value,10);
		var imperialValuePart2 = 0;

		if ((Math.floor(imperialValuePart2Complete) != imperialValuePart2Rnd)) {
			imperialValuePart2 = imperialValuePart2Rnd;
		}
		else {
			imperialValuePart2 = imperialValuePart2Complete;
		}
		if (isNaN(imperialValuePart2)){imperialValuePart2 = 0;}
		var remainder = 0;
		if (flag == "imperialBlockH"){
			// convert cm to feet
			imperialValuePart1 = metricValue * 0.0328084;

			// assign feet
			$scope.BMI.feetHeight = Math.floor(imperialValuePart1);
			imperialBlock.querySelectorAll('input[type="number"]')[0].value = $scope.BMI.feetHeight;

			// calc inches
			remainder = 12 * (imperialValuePart1 - Math.floor(imperialValuePart1));
			// assign inches
			$scope.BMI.inchesHeight = Math.round(remainder);
			imperialBlock.querySelectorAll('input[type="number"]')[1].value = $scope.BMI.inchesHeight;
			imperialBlock.querySelectorAll('input[type="number"]')[1].setAttribute("data-value",remainder);
		}
		else if (flag == "metricBlockH"){
			// feet to centimetres
			$scope.imperialPrep(metricValue,"height");
			metricValue = $scope.BMI.metricHeight.toFixed(2);
			metricBlock.querySelector('input[type="number"]').value = metricValue; // assign cm
		}
		else if (flag == "imperialBlockW"){
			// convert kg to stones
			imperialValuePart1 = metricValue * 0.157473;
			remainder = Math.round(14 * (imperialValuePart1 - Math.floor(imperialValuePart1))); // calc pounds
			if (remainder == 14) {
				remainder = 0;
			}
			// assign stones
			$scope.BMI.stonesWeight = Math.floor(imperialValuePart1);
			imperialBlock.querySelectorAll('input[type="number"]')[0].value = $scope.BMI.stonesWeight;

			// assign pounds
			$scope.BMI.poundsWeight = Math.round(remainder);
			imperialBlock.querySelectorAll('input[type="number"]')[1].value = $scope.BMI.poundsWeight;
			imperialBlock.querySelectorAll('input[type="number"]')[1].setAttribute("data-value",remainder);
		}
		else if (flag == "metricBlockW"){
			// convert stones to kg
			$scope.imperialPrep(metricValue,"weight");
			metricValue = $scope.BMI.metricWeight.toFixed(2);
			metricBlock.querySelector('input[type="number"]').value = metricValue; // assign kg
		}
	};


	// alternateBackGround - function to make the revealed questions have alternative background colours
	$scope.alternateBackGround = function(){
		function isOdd(num) { return num % 2;}
		var j = 0;
		for (var i = 0, len = $scope.arrayOfQuestionDivs.length; i < len; i++) {
			removeClass($scope.arrayOfQuestionDivs[i],'altBckGrnd');
			if (!hasClass($scope.arrayOfQuestionDivs[i],"hide")){
				if (isOdd(j)) {
					addClass($scope.arrayOfQuestionDivs[i],'altBckGrnd');
				}
				j++;
			}
		}
	};


	// revealYesNoToggle - function to reveal or hide an initially hidden pair of questions -
	$scope.revealYesNoToggle = function(revealTarget,hideTarget){
		$scope.reveal(hideTarget,false);
		$scope.reveal(revealTarget,true);
	};


	// reveal - function to reveal or hide an initially hidden question - initial assessment of target object sent
	$scope.reveal = function(revealTarget,revealFlag, optionValue){
		if (revealTarget) {
			var targetName,
				target;
			// Are there multiple targets to reveal?
			if (typeof(revealTarget) === 'object'){
				for (var i = 0, len = revealTarget.length; i < len; i++) {
					targetName = revealTarget[i].cq;
					$scope.revealActualTarget(targetName,revealFlag, optionValue);
				}
			}
			else {
				targetName = revealTarget;
				$scope.revealActualTarget(targetName,revealFlag, optionValue);
			}
		}
	};


	// revealActualTarget - function to reveal or hide an initially hidden question
	$scope.revealActualTarget = function(targetName,revealFlag, optionValue){
		targetName = targetName + "ID";
		target = document.getElementById(targetName);
		if (target){
			var revealer = -1;
			if (optionValue) {
				revealer = optionValue.indexOf("reveal=true");
			}
			if (revealFlag || revealer > -1) {
				removeClass(target,'hide');
			}
			else {
				addClass(target,'hide');
			}
			$scope.alternateBackGround(); // we run this after a question is revealed or hidden to get the alternate pattern again
		}
		else {console.log("false target=" + target);}
	};


	// backwards - stepping backwards through the stages of assessment questions.
	$scope.backwards = function(){
		var stage = parseInt($scope.stageNum.innerHTML,10);
		if (stage > 1) {
			$scope.loadData($scope.arrayOfJSONfiles[stage - 2], stage - 1);
			$scope.decrementStageNum();
			$interval($scope.loadDataFromObj, 500, 1);
		}
	};

	$scope.decrementStageNum = function(){
		var n = parseInt($scope.stageNum.innerHTML,10); // What is the current stage?
		n--; // decrement stage
		$scope.stageNum.innerHTML = n;
		$scope.smallObj.innerHTML = "Step " + n  + " of " +  $scope.totalStagesNum.innerHTML;
	};

	// Repopulate the answers to the questions from the $scope.answersObj array
	$scope.loadDataFromObj = function(){
		window.scrollTo(0,0); // scroll to top of page

		var QNum;
		for (var i = 0, len = $scope.arrayOfQuestionDivs.length; i < len; i++) {
			for (var j = 0, lengthJ = $scope.answersObj.length; j < lengthJ; j++) {
				if (!$scope.arrayOfQuestionDivs[i]){break;}
				if ($scope.arrayOfQuestionDivs[i].id == $scope.answersObj[j].id) {
					QNum = $scope.arrayOfQuestionDivs[i].id.replace("ID", ""); // get the Q number from the saved ID

					// Reveal questions that should be revealed
					if ($scope.answersObj[j].hidden === false) {
						removeClass($scope.arrayOfQuestionDivs[i],"hide");
					}

					// Determine the question type and react accordingly
					var inputType = $scope.answersObj[j].inputType;
					if (inputType == "radio") {
						if ($scope.answersObj[j].value == "yes") {
							QNum = QNum + "Y";
						}
						else {
							QNum = QNum + "N";
						}
						document.getElementById(QNum).checked = true;
					}
					else if (inputType == "select") {
						document.getElementById(QNum).options[$scope.answersObj[j].value.selectedIndex].selected = true;
					}
					else if (inputType == "textarea") {
						$scope.arrayOfQuestionDivs[i].querySelector('textarea').value = $scope.answersObj[j].value;
					}
					else if (inputType == "date") {
						document.getElementById(QNum).value = $scope.answersObj[j].value;
					}
					else if (inputType == "file") {
						// Failed to set the 'value' property on 'HTMLInputElement': This input element accepts a filename, which may only be programmatically set to the empty string. This is a security feature implemented in all end-user browsers to prevent websites from a trivial mischievery:
						//$scope.arrayOfQuestionDivs[i].querySelector('input[type="file"]').value = $scope.answersObj[j].value;
					}
					else if (inputType == "number") {
						// Switch to metric view
						var heightFlag = $scope.arrayOfQuestionDivs[i].querySelector('#metricBlockH');
						if (heightFlag) {$scope.metricSwitcher("metricBlockH");} // for height question
						else {$scope.metricSwitcher("metricBlockW");} // for weight question

						// Switch on the metric radio button
						var metricRadioInputObj = $scope.arrayOfQuestionDivs[i].querySelector('input.metricRadio');
						metricRadioInputObj.checked = true;

						// Find metric number input
						var metricNumberInputObj = $scope.arrayOfQuestionDivs[i].querySelector('input.metric');
						// Insert old metric value into number input
						metricNumberInputObj.value = ($scope.answersObj[j].value).toFixed(2);
					}
					else if (inputType == "checkbox") {
						var interimValueObj = $scope.answersObj[j].value;
						if (typeof(interimValueObj) === 'object') {
							// Loop to cope with multiple checkboxes ticked
							for (var k = 0, lengthK = interimValueObj.length; k < lengthK; k++) {
								//console.log(k + " interimValueObj[k].subValue=" + interimValueObj[k].subValue);//!!
								if (interimValueObj[k].subValue == "on") { // the default value for a single checked checkbox
									$scope.arrayOfQuestionDivs[i].querySelector('input[type="checkbox"]').checked = true;
								}
								else {
									$scope.arrayOfQuestionDivs[i].querySelector('input[value="' + interimValueObj[k].subValue + '"').checked = true;
								}
							}
						}
						else if (interimValueObj == "yes") {
							$scope.arrayOfQuestionDivs[i].querySelector('input[type="checkbox"]').checked = true;
						}
						else {
							console.log("interimValueObj is not an object nor = yes");
						}
					}
					else if ($scope.answersObj[j].hidden) {
						//console.log("Hidden question i =" + i + " hidden=" + $scope.answersObj[j].hidden);
					}
					else {
						console.log("Unknown input type of i =" + i + "  " + " inputType=" + inputType + " hidden=" + $scope.answersObj[j].hidden);//!!
					}
					
					// Reveal green tick
					var greenTickObj = $scope.arrayOfQuestionDivs[i].querySelectorAll("span.-has-success")[0]; // find the span within the parent question DIV with the "-has-success" class.
					removeClass(greenTickObj,"hide");
					
				}
			}
		}
		$scope.stageTidyUp(); // stop non-number input into number only inputs
	};


	// formInputChange - reacts to a change in a form input with a green tick
	$scope.formInputChange = function(){
		var parentQ = findAncestor(event.target,"question"); // find the parent DIV for this question
		if (parentQ){
			var greenTickObj = parentQ.querySelectorAll("span.-has-success")[0]; // find the span within the parent question DIV with the "-has-success" class.
			var requiredObj = parentQ.querySelectorAll("span.requireClass")[0]; // find the span within the parent question DIV  with the "Required" text in it.
			if (greenTickObj && requiredObj) {
				// radio buttons
				if (event.target.defaultValue){
					if (event.target.defaultValue == "yes" || event.target.defaultValue == "no") {
						removeClass(greenTickObj,"hide");
					}
				}
				// textareas - no longer empty
				else if (event.target.value != event.target.defaultValue) {
					removeClass(greenTickObj,"hide");
				}
				// hide the tick
				else {
					addClass(greenTickObj,"hide");
				}
			}
			else {
				console.log("greenTickObj or requiredObj is missing!! " + greenTickObj + requiredObj);
			}
		}
		else {
			console.log("parentQ is missing!! " + parentQ);
		}
	};


	// stopFutureDates - stop the date input from accepting future dates, as it is meaningless for the morning after pill
	$scope.stopFutureDates = function(){
		// pick up all the inputs with type = date
		var dateInputs = document.querySelectorAll("input[type='date']");
		// set today's date
		var now = new Date(),
			maxDate = now.toISOString().substring(0,10);
		if (dateInputs) {
			for (var D = 0, lengthD = dateInputs.length; D < lengthD; D++) {
				// set the max attribute to today's date
				dateInputs[D].setAttribute("max",maxDate);
			}
		}
		//console.log("maxDate=" + maxDate);//!!
	};


	// ghostInputter - a temporary feature to speed up the review process
	$scope.ghostInputter = function() {
		$scope.debug = true;
		// pick up all the inputs with type = radio
		var radioInputs = document.querySelectorAll("input[type='radio']");
		if (radioInputs.length > 0) {
			for (var R = 0, lengthR = radioInputs.length; R < lengthR; R++) {
				// set to No
				if (radioInputs[R].value == "no") {
					radioInputs[R].checked = true;
				}
			}
		}
		
		// pick up all the drop downs
		var dropdownInputs = document.querySelectorAll("select");
		if (dropdownInputs.length > 0) {
			for (var S = 0, lengthS = dropdownInputs.length; S < lengthS; S++) {
				// set to first answer
				dropdownInputs[S].selectedIndex = "1";
			}
		}
		
		// pick up the number inputs, set a default weight and height
		var numberInputs = document.querySelectorAll("input[type='number']");
		//console.log("numberInputs=" + numberInputs.length);//!!
		if (numberInputs.length > 0) {
			$scope.BMI.feetHeight = 5;
			$scope.BMI.inchesHeight = 10;
			$scope.BMI.stonesWeight = 11;
			$scope.BMI.poundsWeight = 7;
			$scope.imperialPrep();
		}
		
		// pick up all the checkboxes
		var checkboxes = document.querySelectorAll("input[type='checkbox']");
		if (checkboxes) {
			for (var C = 0, lengthC = checkboxes.length; C < lengthC; C++) {
				//console.log(C + " checkboxes[C].value=" + checkboxes[C].value);//!!
				// switch on
				if (checkboxes[C].value === "on" || checkboxes[C].value === "No symptoms"){
					checkboxes[C].checked = true;
				}
			}
		}
		
		// pick up the date input
		var dateInput = document.querySelector("input[type='date']");
		if (dateInput && dateInput.length > 0) {
			var now = new Date(),
			today = now.toISOString().substring(0,10);
			// set date to today
			dateInput.value = today;
		}
	}


	// There are a few functions to be called after each stage is loaded from the JSON file
	$scope.stageTidyUp = function() {
		//console.log("$scope.stageTidyUp");//!!
		$scope.arrayOfQuestionDivs = document.querySelectorAll('div.question'); // collect all the DIVs with question class
		collapseHiddenQs();
		stopNonNumbers();
		$scope.stopFutureDates();
		$scope.alternateBackGround();
		if ($scope.debug) $scope.ghostInputter();//!!
	};

});

// Generic functions
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function hasClass(ele,cls) {
	if (ele) {
		return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	}
	else {
		console.log("hasClass ele=" + ele + " !!");
		return false;
	}
}

function addClass(ele,cls) {
	if (!ele) {
		console.log("addClass ele=" + ele + " !!");
		return false;
	}
	if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (!ele) {
		console.log("removeClass ele=" + ele + " eval=" + eval(ele) + " class=" + cls + " !!");
		return false;
	}
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}

// Allow only numbers to be keyed inside the number type inputs
function stopNonNumbers() {
	var allTheNumberInputs = document.querySelectorAll("input[type='number']");
	//console.log("allTheNumberInputs=" + allTheNumberInputs + allTheNumberInputs.length);//!!
	if (allTheNumberInputs) {
		for (var N = 0, lengthN = allTheNumberInputs.length; N < lengthN; N++) {
			allTheNumberInputs[N].addEventListener("keypress", function (evt) {
				if (evt.which < 48 || evt.which > 57){
					evt.preventDefault();
				}
			});
		}
	}
}

// Collapse those hidden questions needed for BMI and combination flags
function collapseHiddenQs() {
	var collapsibles = document.querySelectorAll('input[type="hidden"]'),
		parentOfHidden = false;
	//console.log("collapsibles=" + collapsibles + collapsibles.length);//!!
	if (collapsibles) {
		for (var N = 0, lengthN = collapsibles.length; N < lengthN; N++) {
			parentOfHidden = findAncestor(collapsibles[N],"question");
			if (parentOfHidden) {
				addClass(parentOfHidden,"collapse");
			}
			parentOfHidden = false;
		}
	}
}

// Find an ancestor of a DOM object with a specfic class
function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls)); // the semi-colon on this line is important!
    return el;
}

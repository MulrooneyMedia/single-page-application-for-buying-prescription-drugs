// directives.js - inserts a header
angular.module('synergixPrototypeApp')
	.directive('synergixPrototypeHeader', function(){
		return {
			restrict : 'AEC',
			replace :true,
			templateUrl : 'partials/header.html'
		}
}) // inserts a footer
angular.module('synergixPrototypeApp')
	.directive('synergixPrototypeFooter', function(){
		return {
			restrict : 'AEC',
			replace :true,
			templateUrl : 'partials/footer.html'
		}
})

angular.module('synergixPrototypeApp')
	.directive('repeatEnd', function() {
		return {
			restrict: "A",
			link: function (scope, element, attrs) {
				if (scope.$last) {
					scope.$eval(attrs.repeatEnd);
				}
			} 
		};
})

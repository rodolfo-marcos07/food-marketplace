appModule.directive('loginBox', function($rootScope, loadingFactory){
	var linkr = function(scope, element, attrs){

	};
	var controller = function($rootScope){

	};
	var template = '<div class="loadingBox"><div>Carregando</div></div>';
	// DDO
	return{
		controller: controller,
		link: linkr,
		template: template
	}
});
appModule.directive('loading-item', function($rootScope){
	var linkr = function(scope, element, attrs){

	};
	var controller = function($rootScope){

	};
	var template = '<div class="loading-item"><div>Carregando</div></div>';
	// DDO
	return{
		controller: controller,
		link: linkr,
		template: template
	}
});
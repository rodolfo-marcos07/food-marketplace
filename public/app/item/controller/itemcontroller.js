appModule.controller('novoItemController', function($scope, cardapioService, CATEGORIAS){
	$scope.item = {};
	$scope.categoriasOpt = CATEGORIAS;
	$scope.file_changed = function(element) {
		$scope.$apply(function(scope) {
			var photofile = element.files[0];
		});
	};
	$scope.salvar = function(){
		cardapioService.salvar($scope.item.titulo, $scope.item.desc, $scope.item.imagem, $scope.item.categoria);
	}
});

// Directive
appModule.directive('file', function(){
	return {
		scope: {
			file: '='
		},
		link: function(scope, el, attrs){
			el.bind('change', function(event){
				scope.file = event.target.files[0];
				scope.$apply();
				// var files = event.target.files;
				// var file = files[0];
				// var reader = new FileReader();

				// reader.onload = function(e) {
				// 	// console.log(e.currentTarget.result);
				// 	scope.file = e.currentTarget.result ? e.currentTarget.result : undefined;
				// 	scope.$apply();
				// };
				// reader.readAsDataURL(file);

			});
		}
	};
});
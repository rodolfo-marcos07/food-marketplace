appModule.controller('novoItemController', function($scope, cardapioService, loadingFactory, CATEGORIAS){
	$scope.item = {};
	$scope.categoriasOpt = CATEGORIAS;
	$scope.file_changed = function(element) {
		$scope.$apply(function(scope) {
			var photofile = element.files[0];
		});
	};
	$scope.salvar = function(){
		loadingFactory.loadingOn();
		cardapioService.salvar($scope.item.titulo, $scope.item.descricao, $scope.item.categoria, $scope.item.imagem)
			.then(function(){
				loadingFactory.loadingOff();
				$scope.$apply();
			});
	}
});

// Editar Item
appModule.controller('editarItemController', function($scope, $stateParams, cardapioService, loadingFactory, CATEGORIAS){
	
	var idItem = $stateParams.itemId;

	$scope.item = {};
	$scope.categoriasOpt = CATEGORIAS;

	var q_obter = cardapioService.obterItem(idItem);
	
	// Once retorna os dados uma vez e desliga a escuta do database
	q_obter.once('value', function(snapshot){
		$scope.item = snapshot.val();
		$scope.$apply();
	});

	// Update
	$scope.salvar = function(){
		cardapioService.update($scope.item, idItem);
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
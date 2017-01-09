appModule.controller('novoItemController', function($scope, itemService, loadingFactory, CATEGORIAS){
	
	$scope.item = {};
	$scope.categoriasOpt = CATEGORIAS;
	
	$scope.file_changed = function(element) {
		$scope.$apply(function(scope) {
			var photofile = element.files[0];
		});
	};
	
	$scope.salvar = function(){
		loadingFactory.loadingOn();
		var timestamp = new Date().getTime();
		itemService.salvar($scope.item.titulo, $scope.item.descricao, $scope.item.categoria, $scope.item.imagem, timestamp, $scope.item.preco)
			.then(function(){
				loadingFactory.loadingOff();
				$scope.$apply();
			});
	}

});

// Editar Item
appModule.controller('editarItemController', function($scope, $stateParams, itemService, loadingFactory, CATEGORIAS){	
	
	var idItem = $stateParams.itemId;

	$scope.item = {};
	$scope.categoriasOpt = CATEGORIAS;

	var q_obter = itemService.obterItem(idItem);

	// Once retorna os dados uma vez e desliga a escuta do database
	q_obter.once('value', function(snapshot){
		$scope.item = snapshot.val();
		$scope.$apply();
	});

	$scope.salvar = function(){
		itemService.update($scope.item, idItem);
	}

	$scope.excluir = function(){
		loadingFactory.loadingOn();
		itemService.delete(idItem)
			.then(function(){
				loadingFactory.loadingOff();
				$scope.$apply();
			});
	}
});
appModule.controller('cardapioController', function($scope, cardapioService){
	
	var cardapio = $scope;
	$scope.item = {};
	$scope.itens = [];
	
	var q_obter = cardapioService.obter();
	
	q_obter.then(function(data_callback){
		angular.forEach(data_callback.data, function(value, key) {
			this.push(value);
		}, $scope.itens);
	}, null);

	cardapio.salvar = function(){
		cardapioService.salvar($scope.item.titulo, $scope.item.desc, $scope.item.imagem);
	}
});
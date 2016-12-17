appModule.controller('cardapioController', function($scope, cardapioService){
	
	var cardapio = $scope;
	$scope.itens = [];
	
	var q_obter = cardapioService.obter();
	
	q_obter.then(function(data_callback){
		angular.forEach(data_callback.data, function(value, key) {
			
			var node = this;
			var q_obter_img = cardapioService.obterFilePath(value.imagem);

			q_obter_img.then(function(urlImg){
				value.imagem = urlImg;
				node.push(value);
				$scope.$apply();
			});

		}, $scope.itens);
	}, null);

});
appModule.controller('cardapioController', function($scope, cardapioService, CATEGORIAS){
	
	var cardapio = $scope;
	cardapio.categoriasOpt = CATEGORIAS;
	cardapio.itens = [];
	cardapio.categoria = null;
	
	function getItens(){
		var q_obter = cardapioService.obter(cardapio.categoria);
		// Once retorna os dados uma vez e desliga a escuta do database
		q_obter.once('value', function(snapshot){
			snapshot.forEach(function(item){
				
				var value = item.val();
				var q_obter_img = cardapioService.obterFilePath(value.imagem);

				// Obtém caminho de download da imagem
				q_obter_img.then(function(urlImg){
					value.imagem = urlImg;
					$scope.itens.push(value);
					cardapio.$apply();
				});
			});
		});
	}

	getItens();
	
	cardapio.filtrar = function(){
		$scope.itens = [];
		getItens();
	}
	// q_obter.then(function(data_callback){
	// 	angular.forEach(data_callback.data, function(value, key) {
			
	// 		var node = this;
	// 		var q_obter_img = cardapioService.obterFilePath(value.imagem);

	// 		q_obter_img.then(function(urlImg){
	// 			value.imagem = urlImg;
	// 			node.push(value);
	// 			cardapio.$apply();
	// 		});

	// 	}, $scope.itens);
	// }, null);

});
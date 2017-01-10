appModule.controller('cardapioController', function($scope, cardapioService, CATEGORIAS, ORDEM){
	
	var cardapio = $scope;
	cardapio.categoriasOpt = CATEGORIAS;
	cardapio.ordemOpt = ORDEM;
	cardapio.itens = [];
	cardapio.categoria = null;
	cardapio.ordem = null;
	
	function getItens(){
		var q_obter = cardapioService.obter(cardapio.categoria, cardapio.ordem);
		// Once retorna os dados uma vez e desliga a escuta do database
		q_obter.once('value', function(snapshot){
			snapshot.forEach(function(item){
				
				var keyItem = item.key;
				var value = item.val();
				value.id = keyItem;
				$scope.itens.push(value);

				var q_obter_img = cardapioService.obterFilePath(value.imagem);
				
				// Obtém caminho de download da imagem
				q_obter_img.then(function(urlImg){
					value.imagem = urlImg;
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

	cardapio.up = function(key, rating){
		cardapioService.up(key, categoria, rating+1);
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
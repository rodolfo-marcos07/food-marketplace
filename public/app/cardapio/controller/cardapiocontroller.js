appModule.controller('cardapioController', function($scope, $rootScope, cardapioService, loadingFactory, CATEGORIAS, ORDEM){
	
	var cardapio = $scope;
	
	cardapio.categoriasOpt = CATEGORIAS;
	cardapio.ordemOpt = ORDEM;
	cardapio.itens = [];
	
	$rootScope.categoria = "Todas";
	$rootScope.ordem = null;
	
	function getItens(){

		loadingFactory.loadingOn();
		var q_obter = cardapioService.obter($rootScope.categoria, $rootScope.ordem);
		// Once retorna os dados uma vez e desliga a escuta do database
		q_obter.once('value', function(snapshot){

			if(!snapshot.length){
				loadingFactory.loadingOff();
				cardapio.$apply();
				return;
			}

			snapshot.forEach(function(item){
				
				var keyItem = item.key;
				var value = item.val();
				value.id = keyItem;

				var q_obter_img = cardapioService.obterFilePath(value.imagem);
				
				// Obtém caminho de download da imagem
				q_obter_img.then(function(urlImg){
					value.imagem = urlImg;
					$scope.itens.push(value);
					loadingFactory.loadingOff();
					cardapio.$apply();
				});
			});
		});
	}

	getItens();
	
	$rootScope.filtrar = function(categoria){
		$rootScope.categoria = categoria;
		$scope.itens = [];
		getItens();
	}

	cardapio.up = function(key, categoria, rating){
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
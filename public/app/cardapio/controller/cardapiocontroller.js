appModule.controller('cardapioController', function($scope, $rootScope, cardapioService, loadingFactory, CATEGORIAS, ORDEM){
	
	var cardapio = $scope;
	$rootScope.telaCorrente = "cardapio";
	cardapio.categoriasOpt = CATEGORIAS;
	cardapio.ordemOpt = ORDEM;
	cardapio.itens = [];
	
	$rootScope.categoria = "Todas";
	$rootScope.ordem = null;

	var page = 0;
	var pageItens = 5;
	var listaItens = [];
	
	function getItens(){

		loadingFactory.loadingOn();
		var q_obter = cardapioService.obter($rootScope.categoria, $rootScope.ordem);
		// Once retorna os dados uma vez e desliga a escuta do database
		q_obter.once('value', function(snapshot){

			if(!snapshot.val()){
				loadingFactory.loadingOff();
				cardapio.$apply();
				return;
			}

			snapshot.forEach(function(item){
				
				var keyItem = item.key;
				var value = item.val();
				value.id = keyItem;

				listaItens.push(value);

				// var q_obter_img = cardapioService.obterFilePath(value.imagem);
				
				// // Obtém caminho de download da imagem
				// q_obter_img.then(function(urlImg){
				// 	value.imagem = urlImg;
				// 	$scope.itens.push(value);
				// 	loadingFactory.loadingOff();
				// 	cardapio.$apply();
				// });
			});

			console.log(listaItens);
		});
	}

	getItens();

	$scope.carregar = function(){

		loadingFactory.loadingOn();

		var y = window.scrollY;
		for (var i = page*pageItens; i < (page+1)*pageItens; i++) {
			
			if(i > listaItens.length) break;
			var item = listaItens[i];
			$scope.itens.push(item);
			// var q_obter_img = cardapioService.obterFilePath(listaItens[i]);

			// // Obtém caminho de download da imagem
			// q_obter_img.then(function(urlImg){
			// 	value.imagem = urlImg;
			// 	$scope.itens.push(value);
			// 	loadingFactory.loadingOff();
			// 	cardapio.$apply();
			// });

		}

		setTimeout(function() {
			window.scrollTo(0, y);
			loadingFactory.loadingOff();
			cardapio.$apply();
		}, 500);
		page+=1;

	}
	
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
appModule.controller('cardapioController', function($scope, $rootScope, cardapioService, loadingFactory, configFactory, CATEGORIAS, ORDEM){
	
	var cardapio = $scope;
	$rootScope.telaCorrente = "cardapio";
	cardapio.categoriasOpt = CATEGORIAS;
	cardapio.ordemOpt = ORDEM;
	cardapio.itens = [];
	
	$rootScope.categoria = "Todas";
	$rootScope.ordem = "timestamp";

	$scope.fimItens = false;
	var page = 0;
	var pageItens = configFactory.maxItemPage;
	var listaItens = [];
	
	function getItens(){

		loadingFactory.loadingOn();
		var q_obter = cardapioService.obter($rootScope.categoria, $rootScope.ordem);
		// Once retorna os dados uma vez e desliga a escuta do database
		q_obter.once('value', function(snapshot){

			if(!snapshot.val()){
				loadingFactory.loadingOff();
				cardapio.$apply();
				$scope.fimItens = true;
				return;
			}

			snapshot.forEach(function(item){
				
				var keyItem = item.key;
				var value = item.val();
				value.id = keyItem;

				listaItens.unshift(value);

			});

			$scope.fimItens = false;
			page = 0;
			carregar();

		});
	}

	getItens();
	scrollHandler();

	function scrollHandler(){
		window.addEventListener("scroll", function(){

			if($scope.fimItens) return;
			var alturaPx = 2200;

			if(window.scrollY + window.innerHeight > (alturaPx*page)){
				carregar();
			}

		});
	}

	function carregar(){

		loadingFactory.loadingOn();

		var y = window.scrollY;
		for (var i = page*pageItens; i < (page+1)*pageItens; i++) {
			
			if(i >= listaItens.length){ 
				$scope.fimItens = true;
				break; 
			}
			
			var item = listaItens[i];
			$scope.itens.push(item);
		}

		setTimeout(function() {
			window.scrollTo(0, y);
			loadingFactory.loadingOff();
			cardapio.$apply();
		}, 500);
		page+=1;

	}

	$rootScope.filtrar = function(){
		cardapio.itens = [];
		listaItens = [];
		$rootScope.categoriaAtivo = false;
		getItens();
	}

	cardapio.up = function(key, categoria, rating){
		cardapioService.up(key, categoria, rating+1);
	}

});
appModule.controller('cardapioController', function($scope, $rootScope, cardapioService, loadingFactory, CATEGORIAS, ORDEM){
	
	var cardapio = $scope;
	$rootScope.telaCorrente = "cardapio";
	cardapio.categoriasOpt = CATEGORIAS;
	cardapio.ordemOpt = ORDEM;
	cardapio.itens = [];
	
	$rootScope.categoria = "Todas";
	$rootScope.ordem = "timestamp";

	var fimItens = false;
	var page = 0;
	var pageItens = 5;
	var listaItens = [];
	
	function getItens(){

		// loadingFactory.loadingOn();
		var q_obter = cardapioService.obter($rootScope.categoria, $rootScope.ordem);
		// Once retorna os dados uma vez e desliga a escuta do database
		q_obter.once('value', function(snapshot){

			if(!snapshot.val()){
				loadingFactory.loadingOff();
				cardapio.$apply();
				fimItens = true;
				return;
			}

			snapshot.forEach(function(item){
				
				var keyItem = item.key;
				var value = item.val();
				value.id = keyItem;

				listaItens.unshift(value);

			});

			fimItens = false;
			page = 0;
			$scope.carregar();

		});
	}

	getItens();
	scrollHandler();

	function scrollHandler(){
		window.addEventListener("scroll", function(){

			if(fimItens) return;

			var body = document.body,
			html = document.documentElement;

			var height = Math.max( body.scrollHeight, body.offsetHeight, 
				html.clientHeight, html.scrollHeight, html.offsetHeight );

			if(window.scrollY + window.innerHeight > height - 80){
				$scope.carregar();
			}

		});
	}

	$scope.carregar = function(){

		loadingFactory.loadingOn();

		var y = window.scrollY;
		for (var i = page*pageItens; i < (page+1)*pageItens; i++) {
			
			if(i >= listaItens.length){ 
				fimItens = true;
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
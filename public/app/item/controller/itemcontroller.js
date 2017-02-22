appModule.controller('novoItemController', function($scope, $state, $timeout, $rootScope, itemService, loadingFactory, CATEGORIAS){
	
	$scope.item = {};
	$scope.msgUpload = "Selecione uma imagem";
	$scope.categoriasOpt = CATEGORIAS;
	$rootScope.telaCorrente = "novoItem";

	$scope.selecionaImagem = function(){
		document.getElementById('btnSelecionarImg').click();
	}
	
	$scope.salvar = function(){

		if($scope.formularioItem.$invalid){
			$rootScope.erroAtivo = true;
			$rootScope.mensagemErro = "Preencha todos os campos obrigatórios";
			return;
		}

		loadingFactory.loadingOn();
		var timestamp = new Date().getTime();
		itemService.salvar($scope.item.titulo, $scope.item.descricao, $scope.item.categoria, $scope.item.imagem, timestamp, $scope.item.price)
			.then(function(){
				$timeout(function(){
					loadingFactory.loadingOff();
					$state.go('itemUsuario', {userId: $rootScope.usuario.uid});
				}, 1000);
			});
	}

});

// Editar Item
appModule.controller('editarItemController', function($scope, $rootScope, $state, $stateParams, itemService, cardapioService, loadingFactory, CATEGORIAS){	
	
	$scope.categoriasOpt = CATEGORIAS;
	$rootScope.telaCorrente = "editarItem";
	
	var idItem = $stateParams.itemId;
	$scope.item = {};

	var q_obter = itemService.obterItem(idItem);

	// Once retorna os dados uma vez e desliga a escuta do database
	q_obter.once('value', function(snapshot){
		
		$scope.item = snapshot.val();
		$scope.item.price = parseInt($scope.item.price);

		var q_obter_img = cardapioService.obterFilePath($scope.item.imagem);
		q_obter_img.then(function(urlImg){
			document.getElementById("imagemItem").setAttribute("src",urlImg);
		});
		
		$scope.$apply();
	});

	$scope.salvar = function(){
		
		if($scope.formularioItem.$invalid){
			alert("Invalido");
			return;
		}

		loadingFactory.loadingOn();
		itemService.update($scope.item, idItem)
			.then(function(){
				$state.go('itemUsuario', {userId: $rootScope.usuario.uid});
			});
	}

});


appModule.controller('visualizarItemController', function($scope, $rootScope, $state, $stateParams, itemService, cardapioService, contatoService, loadingFactory, CATEGORIAS){	
		
	var idItem = $stateParams.itemId;
	$scope.itemId = idItem;
	$scope.item = {};
	$scope.novocomentario = "";
	$scope.comentarios = [];
	$rootScope.telaCorrente = "visualizarItem";

	loadingFactory.loadingOn();
	var q_obter = itemService.obterItem(idItem);

	// Once retorna os dados uma vez e desliga a escuta do database
	q_obter.once('value', function(snapshot){
		
		$scope.item = snapshot.val();
		$scope.item.price = parseInt($scope.item.price);

		// visualiza ++
		cardapioService.up(idItem, $scope.item.categoria, $scope.item.usuario.id, parseInt($scope.item.rating)+1);

		// Obter dados do contato
		var dadosUser = contatoService.obter($scope.item.usuario.id);
		dadosUser.once('value', function(snapUser){
			
			$scope.item.contato = snapUser.val().telefone;
			loadingFactory.loadingOff();
			
			obterComentarios();
		});

	});

	function obterComentarios(){
		$scope.comentarios = [];
		var comentário_obter = itemService.obterComentarios(idItem);

		comentário_obter.once('value', function(snapshot){
			
			snapshot.forEach(function(item){
				var comentario = item.val();
				comentario['id'] = item.key;
				$scope.comentarios.push(comentario);
			});

			$scope.$apply();
		});
	}

	$scope.comentar = function(){
		itemService.salvarComentario($scope.itemId, $rootScope.usuario.nome, $rootScope.usuario.uid, $scope.novocomentario)
			.then(function(){
				obterComentarios();
				$scope.novocomentario = "";
			});
	}

	$scope.excluirComentario = function(comentarioId){
		itemService.excluirComentario($scope.itemId, comentarioId)
			.then(function(){
				obterComentarios();
			});
	}

	$scope.excluir = function(){
		loadingFactory.loadingOn();
		itemService.delete($scope.item, idItem)
			.then(function(){
				loadingFactory.loadingOff();
				$state.go('itemUsuario', {userId: $rootScope.usuario.uid});
			});
	}

});

// Item por usuario
appModule.controller('ItemUsuarioController', function($scope, $rootScope, $stateParams, configFactory, itemService, cardapioService, contatoService, loadingFactory, CATEGORIAS){	
		
	var userId = $stateParams.userId;
	$scope.itens = [];
	$rootScope.telaCorrente = "itemUsuario";

	$scope.fimItens = false;
	var page = 0;
	var pageItens = configFactory.maxItemPage;
	var listaItens = [];

	$scope.expandeInfo = false;
	$scope.expandeInfoUsuario = function(){
		$scope.expandeInfo = !$scope.expandeInfo;
	}

	function getItens(){

		loadingFactory.loadingOn();
		var q_obter = itemService.obterUsuario(userId);

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
			$scope.$apply();
		}, 500);
		page+=1;

	}

	function scrollHandler(){
		window.addEventListener("scroll", function(){

			if($scope.fimItens) return;
			var alturaPx = 2200;

			if(window.scrollY + window.innerHeight > (alturaPx*page) - 80){
				carregar();
			}

		});
	}

	var dadosUser = contatoService.obter(userId);
	dadosUser.once('value', function(snapUser){
		$scope.usuarioVisualizar = snapUser.val();
	});

});
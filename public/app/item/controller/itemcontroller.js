appModule.controller('novoItemController', function($scope, $state, $timeout, $rootScope, itemService, loadingFactory, CATEGORIAS){
	
	$scope.item = {};
	$scope.msgUpload = "Selecione uma imagem";
	$scope.categoriasOpt = CATEGORIAS;
	$rootScope.telaCorrente = "novoItem";
	$rootScope.tituloTela = "Novo item";

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
	$rootScope.tituloTela = "Editar item";
	
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
	$rootScope.telaCorrente = "visualizarItem";
	$rootScope.tituloTela = "Visualização";

	loadingFactory.loadingOn();
	var q_obter = itemService.obterItem(idItem);

	// Once retorna os dados uma vez e desliga a escuta do database
	q_obter.once('value', function(snapshot){
		
		$scope.item = snapshot.val();
		$scope.item.price = parseInt($scope.item.price);

		// visualiza ++
		cardapioService.up(idItem, $scope.item.categoria, $scope.item.usuario.id, parseInt($scope.item.rating)+1);

		var q_obter_img = cardapioService.obterFilePath($scope.item.imagem);
		q_obter_img.then(function(urlImg){
			$scope.item.imagem = urlImg;
			loadingFactory.loadingOff();
			$scope.$apply();
			// document.getElementById("imagemItem").setAttribute("src",urlImg);
		});

		// Obter dados do contato
		var dadosUser = contatoService.obter($scope.item.usuario.id);
		dadosUser.once('value', function(snapUser){
			$scope.item.contato = snapUser.val().telefone;
		});
		
		$scope.$apply();
	});

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
appModule.controller('ItemUsuarioController', function($scope, $rootScope, $stateParams, itemService, cardapioService, contatoService, loadingFactory, CATEGORIAS){	
		
	var userId = $stateParams.userId;
	$scope.itens = [];
	$rootScope.telaCorrente = "itemUsuario";
	$rootScope.tituloTela = "Itens";

	loadingFactory.loadingOn();

	var dadosUser = contatoService.obter(userId);
	dadosUser.once('value', function(snapUser){
		$scope.nomeUsuario = snapUser.val().nome;
	});

	var q_obter = itemService.obterUsuario(userId);
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

			var q_obter_img = cardapioService.obterFilePath(value.imagem);
			
			// Obtém caminho de download da imagem
			q_obter_img.then(function(urlImg){
				value.imagem = urlImg;
				$scope.itens.push(value);
				loadingFactory.loadingOff();
				$scope.$apply();
			});
		});
	});
});
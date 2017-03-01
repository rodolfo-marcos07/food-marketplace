var appModule = angular.module('app08', ['ui.router']);

// Firebase Integration
var config = {
	apiKey: "AIzaSyCWZjtflhSSUI59zBs-gqqgUloor2ZGXtI",
	authDomain: "app-08.firebaseapp.com",
	databaseURL: "https://app-08.firebaseio.com",
	storageBucket: "app-08.appspot.com",
	messagingSenderId: "893322157672"
};
firebase.initializeApp(config);

// Main Controller
appModule.controller('mainCtrl', function($scope, $rootScope, $state, loadingFactory, cardapioService, contatoService, CATEGORIAS, CIDADE){

	var main = $scope;

	$rootScope.cidadeSelecionada = "ipua_sp";
	$rootScope.menuAtivo = false;
	$rootScope.categoriaAtivo = false;
	$rootScope.erroAtivo = false;
	$rootScope.telaCorrente = "";
	$rootScope.mensagemErro = "";
	$rootScope.usuario = {};

	main.categoriasOpt = CATEGORIAS;
	main.cidadesOpt = CIDADE;

	// Se a página foi chamada no redirect do login, obtém os dados do usuário
	firebase.auth().getRedirectResult().then(function(result) {
		
		// This gives you a Facebook Access Token. You can use it to access the Facebook API.
		var token = result.credential.accessToken;
		var user = result.user;

		$rootScope.usuario.nome = user.displayName;
		$rootScope.usuario.img = user.photoURL;
		$rootScope.usuario.uid = user.uid;

		localStorage.setItem($rootScope.cidadeSelecionada + "_logged", "true");

		// Cria uma entrada na relação contato, se não existir
		contatoService.obter(user.uid).once('value').then(function(snapshot){
			if(!snapshot.exists()){
				contatoService.salvar(user.uid, {endereco:"", sobre:"", telefone:"", imagem: user.photoURL, cidade: $rootScope.cidadeSelecionada});
			}
		});

		$scope.$apply();

	}).catch(function(error) {

		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;

		var localLogged = localStorage.getItem("logged");
		if(localLogged){
			$rootScope.login();
		}

		loadingFactory.loadingOff();
		$scope.$apply();

	});

	$rootScope.logoff = function(){
		firebase.auth().signOut().then(function() {
			$rootScope.usuario = {};
			localStorage.clear();
			sessionStorage.clear();
			setTimeout(function() {
				$state.go('home', {});
			}, 100);
		}, function(error) {
			console.log(error);
		});
	}

	$rootScope.login = function(){
		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	}

	// Evento quando view é carregada
	$rootScope.$on('$viewContentLoaded', function(event){
		$rootScope.menuAtivo = false;
		$rootScope.erroAtivo = false;
		$rootScope.categoriaAtivo = false;
	});

	$rootScope.toggleFiltro = function(){
		$rootScope.categoriaAtivo =! $rootScope.categoriaAtivo;
	}

	$rootScope.btnMenu = function(){
		$rootScope.menuAtivo = !$rootScope.menuAtivo;
	}

	$rootScope.fecharErro = function(){
		$rootScope.erroAtivo = false;
	}

});

// UI-Router
appModule.config(function($stateProvider, $urlRouterProvider) {

	var homeState = {
		name: 'home',
		url: '/',
		controller: 'cardapioController',
		templateUrl: 'app/cardapio/template/cardapio.html'
	}

	var contatoState = {
		name: 'contato',
		url: '/contato/{userId}',
		controller: 'contatoController',
		templateUrl: 'app/contato/template/contato.html'
	}

	var viewItemState = {
		name: 'visualizarItem',
		url: '/visualizarItem/{itemId}',
		controller: 'visualizarItemController',
		templateUrl: 'app/item/template/visualizar.html'
	}

	var newItemState = {
		name: 'novoItem',
		url: '/novoItem',
		controller: 'novoItemController',
		templateUrl: 'app/item/template/item.html'
	}

	var editItemState = {
		name: 'editarItem',
		url: '/item/{itemId}',
		controller: 'editarItemController',
		templateUrl: 'app/item/template/item.html'
	}

	var itemUsuario = {
		name: 'itemUsuario',
		url: '/itemusuario/{userId}',
		controller: 'ItemUsuarioController',
		templateUrl: 'app/item/template/itemusuario.html'
	}


	$stateProvider.state(contatoState);
	$stateProvider.state(viewItemState);
	$stateProvider.state(editItemState);
	$stateProvider.state(newItemState);
	$stateProvider.state(homeState);
	$stateProvider.state(itemUsuario);
	$urlRouterProvider.otherwise("/");

});

appModule.value('CATEGORIAS', [
	{name: 'Carnes'},
	{name: 'Doces'},
	{name: 'Salgados'},
	{name: 'Pratos Quentes'},
	{name: 'Pratos Frios'},
	{name: 'Todas'},
]);

appModule.value('ORDEM', [
	{name: 'Novos', value: 'timestamp'},
	{name: 'Visualização', value: 'rating'},
	{name: 'Preço Maior', value: 'price'},
	{name: 'Preço Menor', value: 'price_reverse'}
]);

appModule.value('CIDADE', [
	{name: 'Ipuã-SP', value: 'ipua_sp'},
	{name: 'Lavras-MG', value: 'lavras_mg'},
]);

// Obter data
function dataAtualFormatada(){
	var data = new Date();
	var dia = data.getDate();
	if (dia.toString().length == 1)
		dia = "0"+dia;
	var mes = data.getMonth()+1;
	if (mes.toString().length == 1)
		mes = "0"+mes;
	var ano = data.getFullYear();  
	return dia+"/"+mes+"/"+ano;
}
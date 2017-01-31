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
appModule.controller('mainCtrl', function($scope, $rootScope, loadingFactory, cardapioService, CATEGORIAS){

	var main = $scope;

	$rootScope.menuAtivo = false;
	$rootScope.categoriaAtivo = false;
	$rootScope.usuario = {};

	main.categoriasOpt = CATEGORIAS;

	firebase.auth().getRedirectResult().then(function(result) {
		
		// This gives you a Facebook Access Token. You can use it to access the Facebook API.
		var token = result.credential.accessToken;
		var user = result.user;

		$rootScope.usuario.nome = user.displayName;
		$rootScope.usuario.img = user.photoURL;
		$rootScope.usuario.uid = user.uid;

		$scope.$apply();

	}).catch(function(error) {

		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;

		loadingFactory.loadingOff();
		$scope.$apply();

	});

	$rootScope.logoff = function(){
		firebase.auth().signOut().then(function() {
			$rootScope.usuario = {};
			main.$apply();
		}, function(error) {
			console.log(error);
		});
	}

	$rootScope.login = function(){

		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithRedirect(provider);

		// firebase.auth().signInWithPopup(provider).then(function(result) {
			
		// 	// This gives you a Facebook Access Token. You can use it to access the Facebook API.
		// 	var token = result.credential.accessToken;
		// 	var user = result.user;

		// 	$rootScope.usuario.nome = user.displayName;
		// 	$rootScope.usuario.img = user.photoURL;
		// 	$rootScope.usuario.uid = user.uid;
			
		// 	dialog.close();
		// 	$scope.$apply();

		// }).catch(function(error) {
			
		// 	// Handle Errors here.
		// 	var errorCode = error.code;
		// 	var errorMessage = error.message;
		// 	var email = error.email;
		// 	var credential = error.credential;

		// 	loadingFactory.loadingOff();
		// 	$scope.$apply();
		// });
	}

	// Evento quando view é carregada
	$rootScope.$on('$viewContentLoaded', function(event){
		$rootScope.menuAtivo = false;
	});
});

// UI-Router
appModule.config(function($stateProvider, $urlRouterProvider) {

	var homeState = {
		name: 'home',
		url: '/',
		controller: 'cardapioController',
		templateUrl: 'app/cardapio/template/cardapio.html'
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

	$stateProvider.state(editItemState);
	$stateProvider.state(newItemState);
	$stateProvider.state(homeState);
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
	{name: 'Votos', value: 'rating'},
	{name: 'Preço Menor', value: 'Novos'},
	{name: 'Preço Maior', value: 'Novos'}
]);
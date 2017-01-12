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
appModule.controller('mainCtrl', function($scope, $rootScope, loadingFactory, cardapioService){

	var main = $scope;
	$rootScope.usuario = {};

	loadingFactory.loadingOn();

	main.logoff = function(){
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			$rootScope.usuario = {};
			main.$apply();
		}, function(error) {
			// An error happened.
		});
	}

	// facebook Login
	var provider = new firebase.auth.FacebookAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result) {
		// This gives you a Facebook Access Token. You can use it to access the Facebook API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;

		$rootScope.usuario.nome = user.displayName;
		$rootScope.usuario.img = user.photoURL;
		$rootScope.usuario.uid = user.uid;
		
		loadingFactory.loadingOff();
		$scope.$apply();

	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;

		loadingFactory.loadingOff();
		$scope.$apply();
	});

	// View é carregada
	$rootScope.$on('$viewContentLoaded', function(){
		// Expand all new MDL elements
		componentHandler.upgradeDom();
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

// A service that returns a value that can be string, object or functions
appModule.value('CATEGORIAS', [
    {name: 'Carnes'},
    {name: 'Doces'},
    {name: 'Salgados'},
    {name: 'Pratos Quentes'},
    {name: 'Pratos Frios'}
]);

appModule.value('ORDEM', [
	{name: 'Novos', value: 'timestamp'},
	{name: 'Votos', value: 'rating'},
	{name: 'Preço Menor', value: 'Novos'},
	{name: 'Preço Maior', value: 'Novos'}
]);
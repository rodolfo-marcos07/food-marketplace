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
appModule.controller('mainCtrl', function($scope, cardapioService){

});

// Services
appModule.factory('cardapioService', function($http){
	
	// Get a reference to the database service
	var database = firebase.database();
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		salvar: function(tit, desc, cat, file){
			// Get the key when inserting
			var key = database.ref().child('itens').push().key;
			// Get reference for image
			var imgRef = storageRef.child('images/'+key+'.jpg');
			// Upload file
			var uploadTask = imgRef.put(file);

			// Prepare object to save on database
			var updates = {};
			var toSave = {titulo:tit, descricao:desc, imagem:imgRef.fullPath, categoria: cat};
			updates['/itens/'+key] = toSave;

			// Save on database
			return database.ref().update(updates);
		},
		obter: function(categoria){
			// Retorna todas as categorias
			// if(categorias == null){
			// 	var urlDB = 'https://app-08.firebaseio.com/itens.json?"orderBy"="titulo"';
			// 	return $http({method:'GET',url:urlDB});
			// }else{
			// 	var urlDB = 'https://app-08.firebaseio.com/itens.json?"orderBy"="titulo"';
			// 	return $http({method:'GET',url:urlDB});
			// }

			// ################ REAL TIME GET ###############
			if(categorias==null){
				var itensRef = database.ref('itens');
				return itensRef;
			}else{
				var itensRef = database.ref('itens').orderByChild("categoria").equalTo(categoria);
				return itensRef;
			}
		},
		obterFilePath: function(file){
			var starsRef = storageRef.child(file);
			// Get the download URL
			return starsRef.getDownloadURL();
		}
	};
	return service;
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
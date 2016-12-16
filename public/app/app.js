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
	$scope.file_changed = function(element) {
		$scope.$apply(function(scope) {
			var photofile = element.files[0];
		});
	};
});

// Services
appModule.factory('cardapioService', function($http){
	
	// Get a reference to the database service
	var database = firebase.database();
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		salvar: function(t, d, i){
			// Get the key when inserting
			var key = database.ref().child('itens').push().key;
			// Get reference for image
			var imgRef = storageRef.child('images/'+key+'.jpg');
			// Upload file
			var uploadTask = imgRef.put(i);

			// Prepare object to save on database
			var updates = {};
			var toSave = {titulo:t, descricao:d, imagem:imgRef.fullPath};
			updates['/itens/'+key] = toSave;

			// Save on database
			return database.ref().update(updates);
		},
		obter: function(){
			
			var urlDB = 'https://app-08.firebaseio.com/itens.json';
			return $http({method:'GET',url:urlDB});

			// ################ REAL TIME GET ###############
			// var itensRef = database.ref('itens.json');
			// itensRef.on('value', function(snapshot){
			// 	snapshot.forEach(function(item){
			// 		console.log(item.key);
			// 		console.log(item.val());
			// 	});
			// });
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

  $stateProvider.state(homeState);
  $urlRouterProvider.otherwise("/");
});
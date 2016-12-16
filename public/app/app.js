var appModule = angular.module('app08', []);

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
appModule.controller('mainCtrl', function($scope, itemService){
	var main = $scope;
	main.teste = "App 08 beggins";
	$scope.item = {};
	$scope.itens = itemService.obter();
	$scope.salvar = function(){
		itemService.salvar($scope.item.titulo, $scope.item.desc);
	}
});

appModule.factory('itemService', function($http){
	// Get a reference to the database service
	var database = firebase.database();
	var service = {
		salvar: function(t, d){
			// Get the key when inserting
			var key = database.ref().child('itens').push().key
			var updates = {};
			var toSave = {titulo:t, descricao:d};
			updates['/itens/'+key] = toSave;
			return database.ref().update(updates);
		},
		obter: function(){
			var itensRef = database.ref('itens/');
			itensRef.on('value', function(snapshot){
				console.log(snapshot.val());
			});
		}
	};
	return service;
});
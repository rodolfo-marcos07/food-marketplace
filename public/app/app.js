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
	$scope.itens = [];
	
	var q_obter = itemService.obter();
	q_obter.then(function(data_callback){
		console.log(data_callback.data);
	}, null);

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
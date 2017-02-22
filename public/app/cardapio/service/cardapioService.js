appModule.factory('cardapioService', function($http, $rootScope, itemService){
	
	// Get a reference to the database service
	var database = firebase.database();
	
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		up: function(key, categoria, idUsuario, rating){

			var updates = {};

			updates[$rootScope.cidadeSelecionada + '/itens/'+key+'/rating'] = rating;
			updates[$rootScope.cidadeSelecionada + '/categorias/'+categoria+"/"+key+'/rating'] = rating;
			updates[$rootScope.cidadeSelecionada + '/useritem/'+idUsuario+'/'+key+'/rating'] = rating;

			return database.ref().update(updates);
		},
		obter: function(categoria, ordem){
			
			if(categoria !== "Todas"){
				itensRef = database.ref($rootScope.cidadeSelecionada + '/categorias/'+categoria).orderByChild(ordem).limitToLast(200);
			}else{
				var itensRef = database.ref($rootScope.cidadeSelecionada + '/itens/').orderByChild(ordem).limitToLast(200);
			}

			return itensRef;
		},
		obterFilePath: function(file){
			var starsRef = storageRef.child(file);
			return starsRef.getDownloadURL();
		}
	};
	return service;
});
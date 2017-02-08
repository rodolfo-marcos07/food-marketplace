appModule.factory('cardapioService', function($http, $rootScope, itemService){
	
	// Get a reference to the database service
	var database = firebase.database();
	
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		up: function(key, categoria, idUsuario, rating){

			var updates = {};

			updates['/itens/'+key+'/rating'] = rating;
			updates['/categorias/'+categoria+"/"+key+'/rating'] = rating;
			updates['/useritem/'+idUsuario+'/'+key+'/rating'] = rating;

			return database.ref().update(updates);
		},
		obter: function(categoria, ordem){
			var itensRef = database.ref('/itens/').limitToLast(200);
			if(categoria !== "Todas"){
				itensRef = database.ref('/categorias/'+categoria);
			}
			if(ordem){
				itensRef = itensRef.orderByChild(ordem);
			}
			return itensRef;
			// Retorna todas as categorias
			// if(categorias == null){
			// 	var urlDB = 'https://app-08.firebaseio.com/itens.json?"orderBy"="titulo"';
			// 	return $http({method:'GET',url:urlDB});
			// }else{
			// 	var urlDB = 'https://app-08.firebaseio.com/itens.json?"orderBy"="titulo"';
			// 	return $http({method:'GET',url:urlDB});
			// }
			
			// var itensRef = null;
			
			// if(categoria == null && ordem ==  null){
			// 	console.log(categoria, ordem);
			// itensRef = database.ref('itens');
			// }else if(categoria == null && ordem != null){
			// 	console.log(categoria, ordem);
			// 	itensRef = database.ref('itens').orderByChild(ordem);
			// }else if(categoria != null && ordem == null){
			// 	console.log(categoria, ordem);
			// 	itensRef = database.ref('itens').orderByChild("categoria").equalTo(categoria);
			// }else{
			// 	console.log(categoria, ordem);
			// 	itensRef = database.ref('itens').orderByChild(ordem).equalTo(categoria);
			// }

			// return itensRef;
		},
		obterFilePath: function(file){
			var starsRef = storageRef.child(file);
			return starsRef.getDownloadURL();
		}
	};
	return service;
});
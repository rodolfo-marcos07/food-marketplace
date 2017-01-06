appModule.factory('cardapioService', function($http, $rootScope){
	
	// Get a reference to the database service
	var database = firebase.database();
	
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		up: function(key, rating){
			return database.ref('/itens/'+key).update({rating:rating});
		},
		obter: function(categoria, ordem){
			
			// Retorna todas as categorias
			// if(categorias == null){
			// 	var urlDB = 'https://app-08.firebaseio.com/itens.json?"orderBy"="titulo"';
			// 	return $http({method:'GET',url:urlDB});
			// }else{
			// 	var urlDB = 'https://app-08.firebaseio.com/itens.json?"orderBy"="titulo"';
			// 	return $http({method:'GET',url:urlDB});
			// }
			
			var itensRef = null;
			
			if(categoria == null && ordem ==  null){
				console.log(categoria, ordem);
				itensRef = database.ref('itens');
			}else if(categoria == null && ordem != null){
				console.log(categoria, ordem);
				itensRef = database.ref('itens').orderByChild(ordem);
			}else if(categoria != null && ordem == null){
				console.log(categoria, ordem);
				itensRef = database.ref('itens').orderByChild("categoria").equalTo(categoria);
			}else{
				console.log(categoria, ordem);
				itensRef = database.ref('itens').orderByChild(ordem).equalTo(categoria);
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
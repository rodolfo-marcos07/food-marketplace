appModule.factory('itemService', function($http, $rootScope){
	
	// Get a reference to the database service
	var database = firebase.database();
	
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		salvar: function(tit, desc, cat, file, tt, preco){
			// Get the key when inserting
			var key = database.ref().child('itens').push().key;
			// Get reference for image
			var imgRef = storageRef.child('images/'+key+'.jpg');
			// Upload file
			var uploadTask = imgRef.put(file);

			// Prepare object to save on database
			var updates = {};
			var toSave = {
				titulo:tit, 
				descricao:desc, 
				imagem:imgRef.fullPath, 
				categoria: cat,
				rating: 0,
				timestamp: tt,
				price: preco,
				usuario: {
					name: $rootScope.usuario.nome,
					id: $rootScope.usuario.uid
				}
			};

			// Insere na categoria Fan-out
			updates['/categorias/'+cat+"/"+key] = toSave;
			updates['/itens/'+key] = toSave;
			return database.ref().update(updates);
		},
		delete: function(item, key){
			var updates = {};
			updates['/categorias/'+item.categoria+"/"+key] = null;
			updates['/itens/'+key] = null;

			var imgRef = storage.ref(item.imagem);
			imgRef.delete().then(function(){}).catch(function(error) {
				console.log(error);
			});

			return database.ref().update(updates);
		},
		update: function(item, key){
			var updates = {};
			updates['/categorias/'+item.categoria+"/"+key] = item;
			updates['/itens/'+key] = item;
			return database.ref().update(updates);
		},
		obterItem: function(itemId){		
			return database.ref('itens/' + itemId);
		}
	};
	return service;
});
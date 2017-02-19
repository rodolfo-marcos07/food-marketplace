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

			return uploadTask.then(function(){
				return imgRef.getDownloadURL().then(function(url){

					// Prepare object to save on database
					var updates = {};
					var toSave = {
						titulo:tit, 
						descricao:desc, 
						imagem:url, 
						categoria: cat,
						rating: 0,
						timestamp: tt,
						data: dataAtualFormatada(),
						price: preco,
						usuario: {
							name: $rootScope.usuario.nome,
							id: $rootScope.usuario.uid
						}
					};

					// Fan-out multiplas inserções
					updates['/itens/'+key] = toSave;
					updates['/categorias/'+cat+'/'+key] = toSave;
					updates['/useritem/'+$rootScope.usuario.uid+'/'+key] = toSave;

					return database.ref().update(updates);

				});
			});

		},
		delete: function(item, key){
			
			var updates = {};
			
			updates['/itens/'+key] = null;
			updates['/categorias/'+item.categoria+"/"+key] = null;
			updates['/useritem/'+item.usuario.id+'/'+key] = null;
			updates['/comentarios/'+key] = null;

			var imgRef = storage.refFromURL(item.imagem);
			imgRef.delete().then(function(){}).catch(function(error) {
				console.log(error);
			});

			return database.ref().update(updates);
		},
		update: function(item, key){
			
			var updates = {};
			
			updates['/itens/'+key] = item;
			updates['/categorias/'+item.categoria+"/"+key] = item;
			updates['/useritem/'+item.usuario.id+'/'+key] = item;

			return database.ref().update(updates);
		},
		obterItem: function(itemId){	
			return database.ref('itens/' + itemId);
		},
		obterUsuario: function(userId){
			var itensRef = database.ref('/useritem/' + userId);
			return itensRef;
		},
		obterComentarios: function(itemId){
			return database.ref('/comentarios/' + itemId).limitToLast(10);
		},
		excluirComentario: function(itemId, comentarioId){
			var updates = {};
			updates['/comentarios/'+itemId+'/'+comentarioId] = null;
			return database.ref().update(updates);
		},
		salvarComentario: function(itemId, nomeUsuario, idUsuario, comentarioTexto){
			
			var key = database.ref().child('comentarios/' + itemId + '/').push().key;
			var updates = {};

			var toSave = {
				usuario: nomeUsuario,
				usuarioId: idUsuario,
				comentario: comentarioTexto,
				data: dataAtualFormatada()
			}

			updates['/comentarios/'+itemId+'/'+ key] = toSave;
			return database.ref().update(updates);
		}
	};
	return service;
});
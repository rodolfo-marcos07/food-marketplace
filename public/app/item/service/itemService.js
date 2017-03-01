appModule.factory('itemService', function($http, $rootScope){
	
	// Get a reference to the database service
	var database = firebase.database();
	
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		salvar: function(tit, desc, cat, file, tt, preco){
			
			// Get the key when inserting
			var key = database.ref($rootScope.cidadeSelecionada).child('itens').push().key;
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
						price_reverse: -preco,
						usuario: {
							name: $rootScope.usuario.nome,
							id: $rootScope.usuario.uid
						}
					};

					// Fan-out multiplas inserções
					updates[$rootScope.cidadeSelecionada+'/itens/'+key] = toSave;
					updates[$rootScope.cidadeSelecionada+'/categorias/'+cat+'/'+key] = toSave;
					updates[$rootScope.cidadeSelecionada+'/useritem/'+$rootScope.usuario.uid+'/'+key] = toSave;

					return database.ref().update(updates);

				});
			});

		},
		delete: function(item, key){
			
			var updates = {};
			
			updates[$rootScope.cidadeSelecionada+'/itens/'+key] = null;
			updates[$rootScope.cidadeSelecionada+'/categorias/'+item.categoria+"/"+key] = null;
			updates[$rootScope.cidadeSelecionada+'/useritem/'+item.usuario.id+'/'+key] = null;
			updates[$rootScope.cidadeSelecionada+'/comentarios/'+key] = null;

			var imgRef = storage.refFromURL(item.imagem);
			imgRef.delete().then(function(){}).catch(function(error) {
				console.log(error);
			});

			return database.ref().update(updates);
		},
		update: function(item, key){
			
			item.price_reverse = -item.price;

			var updates = {};
			
			updates[$rootScope.cidadeSelecionada+'/itens/'+key] = item;
			updates[$rootScope.cidadeSelecionada+'/categorias/'+item.categoria+"/"+key] = item;
			updates[$rootScope.cidadeSelecionada+'/useritem/'+item.usuario.id+'/'+key] = item;

			return database.ref().update(updates);
		},
		obterItem: function(itemId){	
			return database.ref($rootScope.cidadeSelecionada+'/itens/' + itemId);
		},
		obterUsuario: function(userId){
			var itensRef = database.ref($rootScope.cidadeSelecionada+'/useritem/' + userId);
			return itensRef;
		},
		obterComentarios: function(itemId){
			return database.ref($rootScope.cidadeSelecionada+'/comentarios/' + itemId).limitToLast(10);
		},
		excluirComentario: function(itemId, comentarioId){
			var updates = {};
			updates[$rootScope.cidadeSelecionada+'/comentarios/'+itemId+'/'+comentarioId] = null;
			return database.ref().update(updates);
		},
		salvarComentario: function(itemId, nomeUsuario, idUsuario, comentarioTexto){
			
			var key = database.ref().child($rootScope.cidadeSelecionada+'/comentarios/' + itemId + '/').push().key;
			var updates = {};

			var toSave = {
				usuario: nomeUsuario,
				usuarioId: idUsuario,
				comentario: comentarioTexto,
				data: dataAtualFormatada()
			}

			updates[$rootScope.cidadeSelecionada+'/comentarios/'+itemId+'/'+ key] = toSave;
			return database.ref().update(updates);
		}
	};
	return service;
});
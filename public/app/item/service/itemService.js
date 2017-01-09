appModule.factory('itemService', function($http, $rootScope){
	
	// Get a reference to the database service
	var database = firebase.database();
	
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();
	var storageRef = storage.ref();

	var service = {
		salvar: function(tit, desc, cat, file, tt, preco){

			// Update both location
			// https://firebase.googleblog.com/2015/09/introducing-multi-location-updates-and_86.html
			var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
			// Generate a new push ID for the new post
			var newPostRef = ref.child("posts").push();
			var newPostKey = newPostRef.key();
			// Create the data we want to update
			var updatedUserData = {};
			updatedUserData["user/posts/" + newPostKey] = true;
			updatedUserData["posts/" + newPostKey] = {
				title: "New Post",
				content: "Here is my new post!"
			};
			// Do a deep-path update
			ref.update(updatedUserData, function(error) {
				if (error) {
					console.log("Error updating data:", error);
				}
			});
			// Update both location


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

			// Insere na categoria
			database.ref('categoria/'+cat).push(key);
			updates['/itens/'+key] = toSave;
			return database.ref().update(updates);
		},
		delete: function(key, imgid){
			// // Create a reference to the file to delete
			// var desertRef = storageRef.child('images/desert.jpg');

			// // Delete the file
			// desertRef.delete().then(function() {
			//   // File deleted successfully
			// }).catch(function(error) {
			//   // Uh-oh, an error occurred!
			// });

			return database.ref('itens/' + key).remove();
		},
		update: function(item, key){
			database.ref('itens/' + key).set(item);
		},
		obterItem: function(itemId){		
			return database.ref('itens/' + itemId);
		}
	};
	return service;
});
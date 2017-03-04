appModule.factory('contatoService', function($http, $rootScope){

	var database = firebase.database();

	var service = {
		salvar: function(userId, contato){
			return database.ref('contato/' + userId).set(contato);
		},
		update: function(userId, contato){
			var updates = {};
			updates['/contato/'+userId] = contato;
			return database.ref().update(updates);
		},
		obter: function(userId){		
			return database.ref('contato/' + userId);
		}
	};
	return service;
});
appModule.controller('contatoController', function($scope, loadingFactory, contatoService, $stateParams){

	// Colocar loading
	var userid = $stateParams.userId;

	$scope.contato = {};

	contatoService.obter(userid).once('value', function(snapshot){
		$scope.contato = snapshot.val();
		$scope.$apply();
	});

	$scope.salvar = function(){
		contatoService.update(userid, $scope.contato);
	}

});
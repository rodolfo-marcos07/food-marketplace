appModule.controller('contatoController', function($scope, loadingFactory, contatoService, $stateParams){

	// Colocar loading
	var userid = $stateParams.userId;

	$scope.contato = {};

	contatoService.obter(userid).once('value', function(snapshot){
		$scope.contato = snapshot.val();
		$scope.$apply();
	});

	$scope.salvar = function(){
		if($scope.contatoItem.$invalid){
			alert("Preencha todos os campos");
		}
		// contatoService.update(userid, $scope.contato);
	}

});
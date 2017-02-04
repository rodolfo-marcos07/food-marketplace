appModule.controller('contatoController', function($scope, loadingFactory, contatoService, $stateParams, $rootScope){

	// Colocar loading
	var userid = $stateParams.userId;

	$scope.contato = {};

	contatoService.obter(userid).once('value', function(snapshot){
		$scope.contato = snapshot.val();
		$scope.$apply();
	});

	$scope.salvar = function(){
		if($scope.contatoItem.$invalid){
			$rootScope.erroAtivo = true;
			$rootScope.mensagemErro = "Preencha todos os campos obrigatórios";
			return;
		}
		contatoService.update(userid, $scope.contato);
	}

});
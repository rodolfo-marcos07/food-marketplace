appModule.factory("appService", function($rootScope){

	// Cidade
	$rootScope.cidadeSelecionada = "ipua_sp";

	// Erro Handling
	$rootScope.erroAtivo = false;
	$rootScope.mensagemErro = "";

	var service = {

		mostraErro: function(erroMsg){
			$rootScope.mensagemErro = erroMsg;
			$rootScope.erroAtivo = true;
		},
		ocultaErro: function(){
			$rootScope.erroAtivo = false;
		},
		mostraMenu: function(){
			$rootScope.menuAtivo = true;
		},
		ocultaMenu: function(){
			$rootScope.menuAtivo = false;	
		},
		mostraCategoria: function(){
			$rootScope.categoriaAtivo = true;	
		},
		ocultaCategoria: function(){
			$rootScope.categoriaAtivo = false;	
		},
		mostraPopupPerfil: function(){
			$rootScope.popupPerfilAtivo = true;
		},
		ocultaPopupPerfil: function(){
			$rootScope.popupPerfilAtivo = false;
		}
	}

	return service;

});
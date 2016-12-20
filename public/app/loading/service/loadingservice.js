appModule.factory("loadingFactory", function($rootScope){
	function loadingOn(){
		$rootScope.loading = true;
	}
	function loadingOff(){
		$rootScope.loading = false;
	}
	return{
		loadingOn: loadingOn,
		loadingOff: loadingOff
	}
});
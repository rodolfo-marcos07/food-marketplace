appModule.directive('file', function(){
	return {
		scope: {
			file: '='
		},
		link: function(scope, el, attrs){
			el.bind('change', function(event){
				
				scope.file = event.target.files[0];

				// Reload image on view
				var reader = new FileReader();
				reader.onload = function(e){
					
					var imgBlob = e.target.result;
					var img = document.getElementById("imagemItem");
					img.setAttribute("src",imgBlob);

					scope.$apply();
				}

				reader.readAsDataURL(event.target.files[0]);
			});
		}
	};
});
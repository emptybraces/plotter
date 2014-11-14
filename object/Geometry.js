var Geometry = (function(){

	var geometries = {
		cube: null,
		sphere: null,
	};

	return {
		initialize : function initialize(gl)
		{
			geometries.cube 	= new Model(gl, "shader_obj", "cube");
			geometries.sphere 	= new Model(gl, "shader_obj", "sphere");
		},
		//
		// get the clone to each geometry data
		//
		get: function get(geometryId, option)
		{
			var id = geometryId.toLowerCase();
			if (Util.isUndefined(geometries[id])){
				console.error(geometryId + "is not supported");
				return null;
			}

			var geometry = geometries[id];
			var geometryObj = new GeometryObject("shader_obj", geometry, option);
			if (geometry.isLoadCompleted()){
				geometryObj.callbackCompleted();
			}
			return geometryObj;
			// switch(geometryId.toLowerCase()) {
			// 	case "cube":
			// 		Util.defineProperty(option, isLoadCompletedCallback, gemeotries.cube.isLoadCompleted);
			// 		return new GeometryObject(gl, "shader_obj", "cube", option);
			// 	case "sphere":
			// 		Util.defineProperty(option, isLoadCompletedCallback, gemeotries.sphere.isLoadCompleted);
			// 		return new GeometryObject(gl, "shader_obj", "sphere", option);
			// }
		},
	}
})();


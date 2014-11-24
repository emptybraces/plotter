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
			switch(id) {
				case "point":
					return new Point("shader_point", option);
				case "plane":
					var shader_id = "shader_obj";
					if (!Util.isUndefined(option) && !Util.isUndefined(option.text))
						shader_id = "shader_objtex";
					return new Plane(shader_id, option);
				case "cube":
				case "sphere":
					var geometry = geometries[id];
					var geometryObj = new GeometryModel("shader_obj", geometry, option);
					if (geometry.isLoadCompleted()){
						geometryObj.callbackCompleted();
					}
					return geometryObj;
				default:
					console.error(geometryId + "is not supported");
					return null;
			}

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


//
// GeometryManager class
//
var GeometryManager = (function(){

	/// private property
	var geometries_ = {
		cube: null,
		sphere: null,
	};

	/// object
	return {
		// initialize
		initialize : function initialize()
		{
			geometries_.cube 	= new Model("shader_obj", "cube");
			geometries_.sphere 	= new Model("shader_obj", "sphere");
		},
		// gets the clone to each geometry data
		get : function get(geometryId, option)
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
					var geometry = geometries_[id];
					var geometry_obj = new GeometryModel("shader_obj", geometry, option);
					if (geometry.isLoadCompleted()){
						geometry_obj.callbackCompleted();
					}
					return geometry_obj;
				default:
					Util.error("specified id is not supported. specified id is:" + geometryId);
					return null;
			}
		},
	}
})();


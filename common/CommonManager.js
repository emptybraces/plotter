//
// CommonManager class
//
var CommonManager = (function() {

  	/// private properties
	var current_object_id_ = 0;
	var client_width_ = 0;
	var client_height_ = 0;
	var gl_context_ = null;

	///private methods
	// generate object identifier
	function generateId()
	{
		return current_object_id_++;
	}

	return {
		/// getter / setter
		getAspectRatio : function getAspectRatio() {return client_width_ / client_height_;},
		getClientWidth : function getClientWidth() {return client_width_;},
		getClientHeight : function getClientHeight() {return client_height_;},
		setClientWidth : function setClientWidth(val) {client_width_ = val; return this;},
		setClientHeight : function setClientHeight(val) {client_height_ = val; return this;},
		getGLContext : function getGLContext() { return gl_context_;},
		initialize : function initialize(gl) {
			gl_context_ = gl;
			client_width_ = gl.canvas.width;
			client_height_ = gl.canvas.height;
		},
		// manage object unit
		unitObject : function unitObject(instance, option) {
			// fill to option
			if(Util.isUndefined(option)) option = {};
			if(Util.isUndefined(option.name)) option.name = "unnamed";
			option.drawable 	= option.drawable === false ? false : Util.hasFunction(instance.draw);
			option.updateable 	= option.updateable === false ? false : Util.hasFunction(instance.update);
			option.selected 	= false;
			option.id 			= generateId();
			return {
				ins: instance,
				opt: option
			};
		},
		// empty object
		emptyObject : function emptyObject() {
			return emptyObject.object 
			|| (emptyObject.object = {
				ins : new EmptyObject(),
		 		oot : {
					id: -1,
					name: "empty",
					selected: false,
					drawable: false,
					updateable: false
		 		}
			});
		},
		/// constants
		FPS : 1000 / 30,
		AXISX : [1, 0, 0],
		AXISY : [0, 1, 0],
		AXISZ : [0, 0, -1],
		WINDOW_RESIZE_EVENT_DELAY : 300,
		TEXTBOX_VALUE_REFLECT_TIME : 3000,
		PRIMARY_BUFFER_CLEAR_COLOR : [0.07, 0.0, 0.0, 1.0],
		LIGHT_DIRECTION : [-1.0, -1.0, -1.0],
		AMBIENT_COLOR : [0.2, 0.2, 0.2, 0.0],
		AMBIENT_COLOR_SELECTED : [0.3, 0.3, 0.3, 0.0],
		BOUNDARY_COLOR : [1.0, 1.0, 1.0, 1.0],
		OBJECT_MOVE_TYPE : 'XY', // will be delete
		CAMERA_NEAR_LIMIT : 10.0,
		MODEL_MODE_INCLUDE_INDICES : 0,
		MODEL_MODE_NORMAL : 1,
		BILLBOARD_TYPE_XYZ : 0,
		BILLBOARD_TYPE_Y : 1,
		// defualt parameter
		DEFAULT_CAMERA_POSITION : [10.0, 10.0, 20.0],
		DEFAULT_CAMERA_TARGET : [0.0, 0.0, 0.0],
		DEFAULT_CAMERA_UPDIR : [0.0, 1.0, 0.0],
		DEFAULT_CAMERA_FOVY : 45 * Util.DEG2RAD,
		DEFAULT_CAMERA_NEAR_CLIP : 0.1,
		DEFAULT_CAMERA_FAR_CLIP : 100.0,
		DEFAULT_GRIDLINE_INTERVAL : 5.0,
		DEFAULT_GRIDLINE_LENGTH : 40.0,
	    DEFAULT_AXISLINE_LENGTH : 40.0,

	};
})();
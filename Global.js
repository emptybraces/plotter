//! Radian to Degrees
var Rad2Deg = 57.29577951;
//! Degrees to Radian
var Deg2Rad = 0.017453293;

var Global = {
	FPS : 1000 / 30,
	CLIENT_WIDTH : 640,
	CLIENT_HEIGHT : 480,
	INITIAL_CAMERA_POSITION : [10.0, 10.0, 20.0],
	INITIAL_CAMERA_TARGET : [0.0, 0.0, 0.0],
	INITIAL_CAMERA_UPDIR : [0.0, 1.0, 0.0],
	CAMERA_FOVY : 45 * Deg2Rad,
	CAMERA_NEAR_CLIP : 0.1,
	CAMERA_FAR_CLIP : 100.0,
	CAMERA_ASPECT : null,
	LIGHT_DIRECTION : [-1.0, -1.0, -1.0],
	AMBIENT_COLOR : [0.2, 0.2, 0.2, 0.0],
	AMBIENT_COLOR_SELECTED : [0.3, 0.3, 0.3, 0.0],
    GRIDLINE_INTERVAL : 5.0,
    GRIDLINE_LENGTH : 40.0,
    AXISLINE_LENGTH : 40.0,
	MOUSE_SMOOTH_POWER : 0.004,
	MOUSE_WHEEL_POWER : 0.015,
	MOUSE_WHEEL_DEC_RATE : 0.78,
	MOUSE_WHEEL_STOP_LIMIT : 0.01,
	CAMERA_NEAR_LIMIT : 10.0,
	POINT_SIZE : 5.0,
	PRIMARY_BUFFER_CLEAR_COLOR : [0.07, 0.0, 0.0, 1.0],
	PRIMARY_BUFFER_DEPTH_VALUE : 1.0,
	OBJECT_MOVE_TYPE : 'XY',
	TEXTBOX_VALUE_REFLECT_TIME : 3000,
	WINDOW_RESIZE_EVENT_DELAY : 300,
	MODEL_MODE_INCLUDE_INDICES : 0,
	MODEL_MODE_NORMAL : 1,
	TABLE : {
		SIN : (function(){
			var c = new Array(360);
			for (var i = 0; i < 360; ++i)
				c[i] = Math.sin(Deg2Rad * i);
			return c;
		})(),
		COS : (function(){
			var c = new Array(360);
			for (var i = 0; i < 360; ++i)
				c[i] = Math.cos(Deg2Rad * i);
			return c;
		})()
	},
	initialize : function() {
		this.CAMERA_ASPECT = this.CLIENT_WIDTH / this.CLIENT_HEIGHT;
	}
};
Global.initialize();

function viewport(sx, sy, dest){
	dest[0] = sx/2; dest[4] = 0;     dest[8]  = 0; dest[12] = sx/2;
	dest[1] = 0;    dest[5] = -sy/2; dest[9]  = 0; dest[13] = sy/2;
	dest[2] = 0;    dest[6] = 0;     dest[10] = 1; dest[14] = 0;
	dest[3] = 0;    dest[7] = 0;     dest[11] = 0; dest[15] = 1;
	return dest;
};

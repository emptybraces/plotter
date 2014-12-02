//
// ControlManager class
//
var ControlManager = (function() {

	/// private properties member
	var mouse_ = null;

	/// objct
	return {
		initialize : function initialize() {
			mouse_ = new Mouse($("#canvas"));
		},
		mouse : function mouse()
		{
			return mouse_;
		},
		update : function update()
		{
			mouse_.update();

			// event handler 
		    if (mouse_.isClick()) {
		        EventManager.mouseDownEventHandler();
		    } else if(mouse_.isRelease()) {
		        EventManager.mouseUpEventHandler();
		    } else if(mouse_.isMove()) {
		        EventManager.mouseMoveEventHandler();
		    } /*else if(mouse_.isLeave()) {
		    }*/

		    // mouse wheel event
		    if (mouse_.isWheel()) {
		        var delta = 1.0 + mouse_.getWheelDelta();
		        var new_campos = Adp.Vec3.scale(CameraManager.position(), delta);
		        CameraManager.getCurrentCamera().setPosition(new_campos);
		    }
		},
		/// constants
		MOUSE_SMOOTH_POWER : 0.004,
		MOUSE_WHEEL_POWER : 0.015,
		MOUSE_WHEEL_DEC_RATE : 0.78,
		MOUSE_WHEEL_STOP_LIMIT : 0.01,
		MOUSE_BUTTON_TYPE_L : 1,
		MOUSE_BUTTON_TYPE_R : 3,
		MOUSE_BUTTON_TYPE_M : 2,

	};
})();
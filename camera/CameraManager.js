//
// CameraManager class
//
var CameraManager = (function() {

  	/// private properties
	var objects_ = [];
	var current_camera_ = null;
	// matrices
	var view_matrix_ = Adp.Mtx4.identity();
	var pers_matrix_ = Adp.Mtx4.identity();
	var pv_matrix_ = Adp.Mtx4.identity();

	return {
		/// getter / setter
		// specify the current camera
		setCurrentCamera : function setCurrentCamera(object) {
			current_camera_ = object;
			return this;
		},
		// get the current camera
		getCurrentCamera : function getCurrentCamera() {
			return current_camera_;
		},
		// get the view matrix from current camera
		view : function view() {
			return view_matrix_;
		},
		// get the perspective matrix from current camera
		perspective : function perspective() {
			return pers_matrix_;
		},
		// get the perspective matrix from current camera
		pvMatrix : function pvMatrix() {
			return pv_matrix_;
		},
		// get the position from current camera
		position : function position() {
			return current_camera_.getPosition();
		},
		// get the target from current camera
		target : function target() {
			return current_camera_.getTarget();
		},
		// add a camera object
		add : function add(instance, option) {
			// already registered
			if (objects_.some(function(elem){
					return elem == instance;
				})) {
				console.error("already registered so aborted.");
				return;
			}
			// add a object
			objects_.push(CommonManager.unitObject(instance, option));
			if (current_camera_ == null)
				current_camera_ = instance;
		},
		// update process
		update : function update() {
			view_matrix_ = current_camera_.lookAt();
			pers_matrix_ = current_camera_.perspective();
			Adp.Mtx4.multiply(pv_matrix_, pers_matrix_, view_matrix_);
		},
		// constants
	};
})();
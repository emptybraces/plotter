function Camera(eye, target, upDir) {
	this.eye = eye;
	this.target = target;
	this.upDir = upDir;
	this.identityQtn = Adp.Quat.identity(Adp.Quat.create());
}

Camera.prototype.setPosition = function(eye) {
	this.eye = eye;
}
Camera.prototype.getPosition = function() {
	return this.eye;
}
Camera.prototype.setTarget = function(target) {
	this.target = target;
}
Camera.prototype.getTarget = function() {
	return this.target;
}
Camera.prototype.setUpDirection = function(upDir) {
	this.upDir = upDir;
}
Camera.prototype.getUpDirection = function() {
	return this.upDir;
}
Camera.prototype.lookAt = function lookAt(destMatrix) {
	return Adp.Mtx4.lookAt(destMatrix, this.eye, this.target, this.upDir);
}

Camera.prototype.perspective = function perspective(destMatrix) {
	return Adp.Mtx4.perspective(
		destMatrix, 
		Global.CAMERA_FOVY, 
		Global.CAMERA_ASPECT, 
		Global.CAMERA_NEAR_CLIP,
		Global.CAMERA_FAR_CLIP);
}

Camera.prototype.rotate = function(rx, ry, rz) {

	var bufQtn = Adp.Quat.clone(this.identityQtn);
	if (rx) {
		Adp.Quat.rotate(bufQtn, [0, 1, 0], rx);
		Adp.Quat.toVec3(this.eye, this.eye, bufQtn)
		Adp.Quat.toVec3(this.upDir, this.upDir, bufQtn)
	}
	if (ry) {
		// eye to target vector
		var eye2target = [];
		eye2target[0] = this.eye[0] - this.target[0];
		eye2target[1] = this.eye[2] - this.target[2];
		// set perpendicular vector to second argument
		Adp.Quat.rotate(bufQtn, Adp.Vec3.normalize([eye2target[1], 0, -eye2target[0]]), ry);
		Adp.Quat.toVec3(this.eye, this.eye, bufQtn)
		Adp.Quat.toVec3(this.upDir, this.upDir, bufQtn)

	}
	if (rz) {
		Global.QTN_IV.rotate(rx, [0, 0, 1], bufQtn);
		Global.QTN_IV.toVecIII(this.eye, bufQtn, this.eye);
		Global.QTN_IV.toVecIII(this.upDir, bufQtn, this.upDir);
	}
}
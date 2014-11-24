function Camera(shaderId, option) {
	// parent class
  	ObjectBase.call(this, shaderId, true, option);

  	// parameter
	this.target = Adp.Vec3.create();
	up = Global.AXISY;
	this.identityQtn = Adp.Quat.identity(Adp.Quat.create());
	// option
	if (!Util.isUndefined(option)) {
		if (!Util.isUndefined(option.target)) 	this.target = option.target;
		if (!Util.isUndefined(option.upDir)) 	up = option.upDir;
	}
}
// inherits class
Util.inherits(Camera, ObjectBase);

Camera.prototype.setTarget = function(target)
{
	this.target = target;
}
Camera.prototype.getTarget = function()
{
	return this.target;
}
Camera.prototype.setUpDirection = function(upDir)
{
	up = upDir;
}
Camera.prototype.getUpDirection = function()
{
	return up;
}
Camera.prototype.getEye2Target = function getEye2Target()
{
	return Adp.Vec3.subtract(this.getTarget(), this.getPosition());
}
Camera.prototype.getTarget2Eye = function getTarget2Eye()
{
	return Adp.Vec3.subtract(this.getPosition(), this.getTarget());
}
Camera.prototype.lookAt = function lookAt(out)
{
	if (Util.isUndefined(out))
		var out = Adp.Mtx4.identity();
	return Adp.Mtx4.lookAt(out, this.getPosition(), this.getTarget(), this.getUpDirection());
}
Camera.prototype.perspective = function perspective(out)
{
	if (Util.isUndefined(out))
		var out = Adp.Mtx4.identity();
	return Adp.Mtx4.perspective(
		out, 
		Global.CAMERA_FOVY, 
		Global.CAMERA_ASPECT, 
		Global.CAMERA_NEAR_CLIP,
		Global.CAMERA_FAR_CLIP);
}
Camera.prototype.round = function(rx, ry, rz)
{
	var bufQtn = Adp.Quat.clone(this.identityQtn);
	var eye = this.getPosition();
	var up = this.getUpDirection();
	if (rx) {
		Adp.Quat.rotate(bufQtn, Global.AXISY, rx);
		Adp.Quat.toVec3(eye, eye, bufQtn)
		// Adp.Quat.toVec3(up, up, bufQtn)
	}
	if (ry) {
		// eye to target vector
		var eye2target = this.getEye2Target();
		// set perpendicular vector to second argument
		Adp.Quat.rotate(bufQtn, Adp.Vec3.normalize([-eye2target[2], 0, eye2target[0]]), -ry);
		Adp.Quat.toVec3(eye, eye, bufQtn)
		// Adp.Quat.toVec3(up, up, bufQtn)

	}
}
Camera.prototype.getVBOAttributes = function getVBOAttributes()
{
	var p = [1, 1, 1];
	return [p];
}

//
// Camera class
//
function Camera(shaderId, option) {
	// parent class
  	ObjectBase.call(this, shaderId, option);

  	// parameter
	this.target = Adp.Vec3.create();
	this.up = CommonManager.AXISY;
	this.identity_qtn = Adp.Quat.identity();
	this.fovy = CommonManager.DEFAULT_CAMERA_FOVY;
	this.near_clip = CommonManager.DEFAULT_CAMERA_NEAR_CLIP;
	this.far_clip = CommonManager.DEFAULT_CAMERA_FAR_CLIP;
	this.aspect = CommonManager.getAspectRatio();
	// option
	if (!Util.isUndefined(option)) {
		if (!Util.isUndefined(option.target)) 	this.target = option.target;
		if (!Util.isUndefined(option.upDir)) 	this.up = option.upDir;
		if (!Util.isUndefined(option.fovy)) 	this.fovy = option.fovy;
		if (!Util.isUndefined(option.nearClip)) this.near_clip = option.nearClip;
		if (!Util.isUndefined(option.farClip))  this.far_clip = option.farClip;
		if (!Util.isUndefined(option.aspect))   this.aspect = option.aspect;
	}
}
// inherits class
Util.inherits(Camera, ObjectBase);

Camera.prototype.setTarget = function setTarget(target){this.target = target; return this;}
Camera.prototype.setUpDirection = function setUpDirection(upDir){this.up = upDir; return this;}
Camera.prototype.setFovy = function setFovy(fovy){this.fovy = fovy; return this;}
Camera.prototype.setNearClip = function setNearClip(near){this.near_clip = near; return this;}
Camera.prototype.setFarClip = function setFarClip(far){this.far_clip = far; return this;}
Camera.prototype.setAspectRatio = function setAspectRatio(ratio){this.aspect = ratio; return this;}
Camera.prototype.getTarget = function(){return this.target;}
Camera.prototype.getUpDirection = function(){return this.up;}
Camera.prototype.getFovy = function getFovy(fovy){return this.fovy;}
Camera.prototype.getNearClip = function getNearClip(near){return this.near_clip;}
Camera.prototype.getFarClip = function gsetFarClip(far){return this.far_clip;}
Camera.prototype.getAspectRatio = function getAspectRatio(ratio){return this.aspect;}


Camera.prototype.getEye2Target = function getEye2Target(){
	return Adp.Vec3.subtract(this.getTarget(), this.getPosition());
}
Camera.prototype.getTarget2Eye = function getTarget2Eye(){
	return Adp.Vec3.subtract(this.getPosition(), this.getTarget());
}
Camera.prototype.lookAt = function lookAt(out)
{
	var _out = Util.isUndefined(_out) ? Adp.Mtx4.create() : out;
	return Adp.Mtx4.lookAt(
		_out, 
		this.getPosition(), 
		this.target, 
		this.up);
}
Camera.prototype.perspective = function perspective(out)
{
	var _out = Util.isUndefined(_out) ? Adp.Mtx4.create() : out;

	return Adp.Mtx4.perspective(
		_out, 
		this.fovy, 
		this.aspect, 
		this.near_clip,
		this.far_clip);
}
Camera.prototype.round = function(rx, ry, rz)
{
	var bufQtn = Adp.Quat.clone(this.identity_qtn);
	var eye = this.getPosition();
	var up = this.getUpDirection();
	if (rx) {
		Adp.Quat.rotate(bufQtn, CommonManager.AXISY, rx);
		Adp.Quat.toVec3(eye, eye, bufQtn)
		// Adp.Quat.toVec3(up, up, bufQtn)
	}
	if (ry) {
		// eye to target vector
		var eye2target = this.getEye2Target();
		// set perpendicular vector to second argument
		Adp.Quat.rotate(bufQtn, Adp.Vec3.normalize([-eye2target[2], 0, eye2target[0]]), ry);
		Adp.Quat.toVec3(eye, eye, bufQtn)
		// Adp.Quat.toVec3(up, up, bufQtn)

	}
}
Camera.prototype.getVBOAttributes = function getVBOAttributes()
{
	var p = [1, 1, 1];
	return [p];
}

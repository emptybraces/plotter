//
// Model
//
function Model(shaderId, resourceName, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, option);

	// loading model data
	this.model_parts = [];
	Loader.loadModel(
		resourceName, 
		this, 
		function loadCompleted(resultData, modelType) {
			resultData.forEach(function(elem){
				this.model_parts.push(new ModelParts(shaderId, elem, option));
			}, this);
		}
	);
	// parameter
	this.resourceName = resourceName;
}
// inherits class
Util.inherits(Model, ObjectBase);

Model.prototype.isLoadCompleted = function isLoadCompleted()
{
	if (this.model_parts.length == 0) {
		return false;
	}
	return this.model_parts.every(function(elem){
		return elem.isLoadCompleted();
	});
}
Model.prototype.callbackCompleted = function callbackCompleted()
{
	Util.info("callbackCompleted:", this.resourceName);
	// this.setVertexCount(this.modelData[0].geometryData.position.length/3);
}

Model.prototype.updateVBO = function updateVBO()
{
	this.model_parts.forEach(function(elem){
		elem.updateVBO(elem.getVBOAttributes());
	});
}

Model.prototype.draw = function draw(shader, matrices, objOption)
{
	var option = {};
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null) {
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
		// light direction rotate
		option.lightDirection = Adp.Vec3.create();
		Adp.Mtx4.invert(matrices.inv, matrices.m);
		Adp.Mtx4.multiplyVec3(option.lightDirection, matrices.inv, CommonManager.LIGHT_DIRECTION);
	}
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);

	// draw a children
	this.model_parts.forEach(function(elem){
		elem.draw(shader, matrices, objOption, option);
	})
} 

Model.prototype.drawForObjectPicking = function drawForObjectPicking(shader, matrices, objOption)
{
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null) {
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
	}
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the shader parameter
	shader.setMVPMatrix(matrices.m);
	// draw children
	this.model_parts.forEach(function(elem){
		elem.drawForObjectPicking(shader, matrices, objOption);
	})
} 

//
// Model
//
function Model(gl, shaderId, resourceName, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, false);

	// loading model data
	this.modelParts		= [];
	Loader.loadModel(
		resourceName, 
		this, 
		function loadCompleted(resultData, modelType) {
			resultData.forEach(function(elem){
				this.modelParts.push(new ModelParts(gl, shaderId, elem, option));
			}, this);
		}
	);
	// parameter
	this.resourceName = resourceName;
	// Util.fillUndefined(opt, {});
	// this.setPosition(position);
	// this.setColor([1.0, 1.0, 0.0, 1.0]);
	// this.setScale([2, 2, 2]);
	// this.setIndex(this.sphere.i);

}
// inherits class
Util.inherits(Model, ObjectBase);

Model.prototype.isLoadCompleted = function isLoadCompleted()
{
	if (this.modelParts.length == 0) {
		return false;
	}
	return this.modelParts.every(function(elem){
		return elem.isLoadCompleted();
	})
}
Model.prototype.callbackCompleted = function callbackCompleted(gl)
{
	console.log("callbackCompleted:", this.resourceName);
	// this.setVertexCount(this.modelData[0].geometryData.position.length/3);
}

Model.prototype.createVBO = function createVBO(gl /*, attributes*/)
{
	this.modelParts.forEach(function(elem){
		elem.createVBO(gl);
	})
}
Model.prototype.updateVBO = function updateVBO(gl /*, attributes*/)
{
	this.modelParts.forEach(function(elem){
		elem.updateVBO(gl);
	})
}
Model.prototype.createIBO = function createIBO(gl /*, index*/)
{
	this.modelParts.forEach(function(elem){
		elem.createIBO(gl);
	})
}
Model.prototype.getVBOAttributes = function getVBOAttributes(){}
Model.prototype.getIndex = function getIndex(){}

Model.prototype.draw = function draw(gl, shader, matrices, objOption)
{
	var option = {};
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null) {
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
		// light direction
		option.lightDirection = Adp.Vec3.create();
		Adp.Mtx4.invert(matrices.inv, matrices.m);
		Adp.Mtx4.multiplyVec3(option.lightDirection, matrices.inv, Global.LIGHT_DIRECTION);
	}
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);

	// draw children
	this.modelParts.forEach(function(elem){
		elem.draw(gl, shader, matrices, objOption, option);
	})
} 

Model.prototype.drawForObjectPicking = function drawForObjectPicking(gl, shader, matrices, objOption)
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
	shader.setMVPMatrix(gl, matrices.m);
	// draw children
	this.modelParts.forEach(function(elem){
		elem.drawForObjectPicking(gl, shader, matrices, objOption);
	})
} 

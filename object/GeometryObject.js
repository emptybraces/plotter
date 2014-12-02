//
// GeometryModel class
//
function GeometryModel(shaderId, geometryRef, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, option);

  	// parameter
  	this.geometryRef = geometryRef;
}
// inherits class
Util.inherits(GeometryModel, ObjectBase);

GeometryModel.prototype.isLoadCompleted = function isLoadCompleted()
{
	if (!Util.isUndefined(this.geometryRef)){
		return this.geometryRef.isLoadCompleted();
	}
	return true;
}
GeometryModel.prototype.callbackCompleted = function callbackCompleted()
{
	var data = this.geometryRef.model_parts[0].geometryData;
	// position
	this.setLocalPositionVertices(data.position.subarray(0));
	// normal
  	this.normal = data.normal.subarray(0);
  	// vertex count
  	this.setVertexCount(this.normal.length / 3);
  	// now, we already do not need
  	delete(this.geometryRef);

  	// create the vbo
  	this.createVBO(this.getVBOAttributes());
}

GeometryModel.prototype.getVBOAttributes = function getVBOAttributes()
{
	// make array for color data
	var color = Util.increaseElement(this.getColor(), this.getVertexCount());
	return [this.getLocalPositionVertices(), this.normal, color];
}

GeometryModel.prototype.draw = function draw(shader, matrices, opt)
{
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null) {
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
	}
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	
	// passing the shader paramter
	this.getBuffer().bindAttribute(
		shader.getAttributeLocations(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(matrices.m);
	shader.setDirectionLight(CommonManager.LIGHT_DIRECTION);
	shader.setIsUseLight(true);
	shader.setAmbientColor(opt.selected ? CommonManager.AMBIENT_COLOR_SELECTED : CommonManager.AMBIENT_COLOR);
	// draw
	Adp.GL.drawTriangles(0, this.getVertexCount());
} 

GeometryModel.prototype.drawForObjectPicking = function drawForObjectPicking(shader, matrices)
{
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null)
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the shader paramter
	this.getBuffer().bindAttribute(
		[shader.getAttributeLocations()[0]], 
		[shader.getAttributeStride()[0]]);
	shader.setMVPMatrix(matrices.m);
	// draw
	Adp.GL.drawTriangles(0, this.getVertexCount());
} 

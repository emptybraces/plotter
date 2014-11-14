function GeometryObject(shaderId, geometryRef, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, true);

  	// paramter
  	this.geometryRef = geometryRef;
}
// inherits class
Util.inherits(GeometryObject, ObjectBase);

GeometryObject.prototype.isLoadCompleted = function isLoadCompleted()
{
	if (!Util.isUndefined(this.geometryRef)){
		return this.geometryRef.isLoadCompleted();
	}
	return true;
}
GeometryObject.prototype.callbackCompleted = function callbackCompleted()
{
	console.log("callbackCompleted:", this.geometryRef.resourceName);

	var data = this.geometryRef.modelParts[0].geometryData;
	this.setLocalPositionVertices(data.position.subarray(0));
  	this.normal = data.normal.subarray(0);
  	this.setVertexCount(this.normal.length / 3);

  	delete(this.geometryRef);
}

GeometryObject.prototype.getVBOAttributes = function getVBOAttributes()
{
	// make array for color data
	var color = Util.increaseArrayElement(this.getColor(), this.getVertexCount());
	return [this.getLocalPositionVertices(), this.normal, color];
}

GeometryObject.prototype.draw = function draw(gl, shader, matrices, opt)
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
	this.getBuffer().setAttribute(
		gl,
		shader.getAttributeLocation(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(gl, matrices.m);
	shader.setDirectionLight(gl, Global.LIGHT_DIRECTION);
	shader.setIsUseLight(gl, true);
	shader.setAmbientColor(gl, opt.selected ? Global.AMBIENT_COLOR_SELECTED : Global.AMBIENT_COLOR);
	// draw
	gl.drawArrays(gl.TRIANGLES, 0, this.getVertexCount());
} 

GeometryObject.prototype.drawForObjectPicking = function drawForObjectPicking(gl, shader, matrices)
{
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null)
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the shader paramter
	this.getBuffer().setAttribute(
		gl,
		[shader.getAttributeLocation()[0]], 
		[shader.getAttributeStride()[0]]);
	shader.setMVPMatrix(gl, matrices.m);
	// draw
	gl.drawArrays(gl.TRIANGLES, 0, this.getVertexCount());
} 

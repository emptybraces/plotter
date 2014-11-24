//
// Point
//
function Point(shaderId, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, true, option);

	// parameter
	if (!Util.isUndefined(option) && !Util.isUndefined(option.size))
		this.setPointSize(option.size);
}
// inherits class
Util.inherits(Point, ObjectBase);

//
// point size setter, getter
//
Point.prototype.setPointSize = function setPointSize(pointSize)
{
	this.pointSize = pointSize;
	return this;
}
Point.prototype.getPointSize = function getPointSize()
{
	return this.pointSize;
}
Point.prototype.getVBOAttributes = function getVBOAttributes()
{
	// local position is 0, 0, 0
	return [new Float32Array(3), this.getColor()];
}
Point.prototype.draw = function draw(gl, shader, matrices)
{
	// calculate matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the shader paramter
	this.getBuffer().setAttribute(
		gl,
		shader.getAttributeLocation(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(gl, matrices.m);
	shader.setPointSize(gl, this.getPointSize());
	shader.setIsObjectPicking(gl, false);
	// draw
	gl.drawArrays(gl.POINTS, 0, 1);
} 
Point.prototype.drawForObjectPicking = function drawForObjectPicking(gl, shader, matrices)
{
	// calculate matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the position shader paramter
	this.getBuffer().setAttribute(
		gl,
		[shader.getAttributeLocation()[0]], 
		[shader.getAttributeStride()[0]]);
	shader.setMVPMatrix(gl, matrices.m);
	shader.setPointSize(gl, this.getPointSize());
	shader.setIsObjectPicking(gl, true);
	// draw
	gl.drawArrays(gl.POINTS, 0, 1);
} 

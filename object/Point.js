//
// Point class
//
function Point(shaderId, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, option);

	// initialize
	this.point_size = 1;
	if (!Util.isUndefined(option) && !Util.isUndefined(option.size))
		this.point_size = option.size;
	this.createVBO(this.getVBOAttributes());

}
// inherits class
Util.inherits(Point, ObjectBase);

//
// point size setter, getter
//
Point.prototype.setPointSize = function setPointSize(size)
{
	this.point_size = size;
	return this;
}
Point.prototype.getPointSize = function getPointSize()
{
	return this.point_size;
}
Point.prototype.getVBOAttributes = function getVBOAttributes()
{
	// local position is 0, 0, 0
	return [new Float32Array(3), this.getColor()];
}
Point.prototype.draw = function draw(shader, matrices)
{
	// calculate matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the shader paramter
	this.getBuffer().bindAttribute(
		shader.getAttributeLocations(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(matrices.m);
	shader.setPointSize(this.getPointSize());
	shader.setIsObjectPicking(false);
	// draw
	Adp.GL.drawPoints(0, 1);
} 
Point.prototype.drawForObjectPicking = function drawForObjectPicking(shader, matrices)
{
	// calculate matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the position shader paramter
	this.getBuffer().bindAttribute(
		shader.getAttributeLocations(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(matrices.m);
	shader.setPointSize(this.getPointSize());
	shader.setIsObjectPicking(true);
	// draw
	Adp.GL.drawPoints(0, 1);
} 

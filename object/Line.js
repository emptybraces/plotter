//
// Line class
//
function Line(shaderId, from, to, fromColor, toColor)
{
	if (!(this instanceof Line)) {
    	return new Line(from, to, fromcolor, toColor, shaderId);
  	}

	if (to.length != 3 || from.length != 3 
		|| fromColor.length != 4 || toColor.length != 4 ) {
		Util.error("invalid parameter.")
		return null;
	}
  	// parent class
  	ObjectBase.call(this, shaderId);

  	// initialize
	this.setLocalPositionVertices(Util.flattenArray([from, to]));
	this.color = Util.flattenArray([fromColor, toColor]);
	this.createVBO(this.getVBOAttributes());

}
// inherits class
Util.inherits(Line, ObjectBase);

//
// override
//
Line.prototype.setPosition = function setPosition(from, to)
{
	if (to.length != 3 || from.length != 3){
		Util.error("invalid parameter.");
		return null;
	}

	this.setLocalPositionVertices(Util.flattenArray([from, to]));
	this.isBufferUpdate(true);
}
//
// gets a parameters for register to vertex buffer object
// callback function
//
Line.prototype.getVBOAttributes = function getVBOAttributes()
{
	return [this.getLocalPositionVertices(), this.color];
}
//
// draw
//
Line.prototype.draw = function draw(shader, matrices)
{
	this.buffer.bindAttribute(
		shader.getAttributeLocations(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(matrices.pv);
	Adp.GL.drawLines(0, 2);
}

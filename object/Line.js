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
		Util.assert(false, "invalid parameter.")
		return null;
	}
  	// parent class
  	ObjectBase.call(this, shaderId, true);

  	// paramter
  	var p = [];
  	this.color = [];
	p.push(from[0], from[1], from[2]);
	p.push(to[0], to[1], to[2]);
	this.color.push(fromColor[0], fromColor[1], fromColor[2], fromColor[3]);
	this.color.push(toColor[0], toColor[1], toColor[2], toColor[3]);
	this.setLocalPositionVertices(p);
}
// inherits class
Util.inherits(Line, ObjectBase);
//
// override
//
Line.prototype.setPosition = function setPosition(from, to)
{
	if (to.length != 3 || from.length != 3){
		console.error("invalid parameter.");
		return null;
	}

	var p = [];
	p.push(from[0], from[1], from[2]);
	p.push(to[0], to[1], to[2]);
	this.setLocalPositionVertices(p);
	this.isBufferUpdate(true);
}
//
// get a parameters for register to vertex buffer object
// callback function
//
Line.prototype.getVBOAttributes = function getVBOAttributes()
{
	return [this.getLocalPositionVertices(),
			this.color];
}
//
// draw
//
Line.prototype.draw = function draw(gl, shader, matrices)
{
	this.buffer.setAttribute(
		gl,
		shader.getAttributeLocation(), 
		shader.getAttributeStride());

	shader.setMVPMatrix(gl, matrices.pv);
	gl.drawArrays(gl.LINES, 0, 2);
}

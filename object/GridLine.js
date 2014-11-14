//
// GridLine class
//
function GridLine(shaderId)
{
	if (!(this instanceof GridLine)) {
    	return new GridLine(shaderId);
  	}
  	// parent class
  	ObjectBase.call(this, shaderId, true);

    // calculate line vertex
    this.calculate(Global.GRIDLINE_INTERVAL, Global.GRIDLINE_LENGTH);

}

// inherits class
Util.inherits(GridLine, ObjectBase);

//
// calculate line vertex
//
GridLine.prototype.calculate = function calculate(interval, length)
{
	var p = [];
	// first: cross line
	p.push(0, 0, -length);	// z start 
	p.push(0, 0,  length);	// z end
	p.push(-length, 0, 0);	// x start 
	p.push( length, 0, 0);	// x end
	// second: plus or minus line
	for (var i = 1, l = Math.ceil(length/interval); i <= l; ++i) {
		p.push(interval * i, 0, -length);	// z start 
		p.push(interval * i, 0,  length);	// z end
		p.push(interval * -i, 0, -length);	// z start 
		p.push(interval * -i, 0,  length);	// z end
		p.push(-length, 0, interval * i);	// x start 
		p.push( length, 0, interval * i);	// x end
		p.push(-length, 0, interval * -i);	// x start 
		p.push( length, 0, interval * -i);	// x end
	}
	this.setLocalPositionVertices(p);
	this.setVertexCount(p.length/3);
	this.isBufferUpdate(true);
}
//
//
//
GridLine.prototype.getVBOAttributes = function getVBOAttributes()
{
	return [this.getLocalPositionVertices(),
			Util.increaseArrayElement(this.getColor(), this.getVertexCount())];
}
//
// draw
//
GridLine.prototype.draw = function draw(gl, shader, matrices)
{
	this.buffer.setAttribute(
		gl,
		shader.getAttributeLocation(), 
		shader.getAttributeStride());

	shader.setMVPMatrix(gl, matrices.pv);
	gl.drawArrays(gl.LINES, 0, this.getVertexCount());
}


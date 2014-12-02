//
// GridLine class
//
function GridLine(shaderId)
{
	if (!(this instanceof GridLine)) {
    	return new GridLine(shaderId);
  	}
  	// parent class
  	ObjectBase.call(this, shaderId);

  	// private properties
  	this.gridline_interval	= CommonManager.DEFAULT_GRIDLINE_INTERVAL;
	this.gridline_length 	= CommonManager.DEFAULT_GRIDLINE_LENGTH;

    // calculate line vertex
    this.calculate(CommonManager.DEFAULT_GRIDLINE_INTERVAL, CommonManager.DEFAULT_GRIDLINE_LENGTH);
    // create vbo
    this.getBuffer().createVBO(this.getVBOAttributes());
   	this.isBufferUpdate(false);
}

// inherits class
Util.inherits(GridLine, ObjectBase);

// getter / setter
GridLine.prototype.getGridLineInterval = function getGridLineInterval() {return this.gridline_interval;}
GridLine.prototype.getGridLineLength = function gsetGridLineLength() {return this.gridline_length;}
GridLine.prototype.setGridlineInterval = function setGridLineInterval(val) {this.gridline_interval = val; return this;}
GridLine.prototype.setGridLineLength = function setGridLineLength(val) {this.gridline_length = val; return this;}
GridLine.prototype.getVBOAttributes = function getVBOAttributes(){
	return [this.getLocalPositionVertices(),
			Util.increaseElement(this.getColor(), this.getVertexCount())];
}

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
// draw
//
GridLine.prototype.draw = function draw(shader, matrices)
{
	this.getBuffer().bindAttribute(
		shader.getAttributeLocations(), 
		shader.getAttributeStride());

	shader.setMVPMatrix(matrices.pv);
	Adp.GL.drawLines(0, this.getVertexCount());
}


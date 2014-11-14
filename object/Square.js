//
// Square class
//
function Square(shaderId, position, color, sidew, sideh, scale)
{
  	// parent class
  	ObjectBase.call(this, shaderId, true);

	// polygon
	this.polygon = new Polygon(
		(function(){
			var x2 = sidew/2; 
			var y2 = sideh/2;
			var v1 = Adp.Vec3.create(-x2, +y2, 0);
			var v2 = Adp.Vec3.create(+x2, +y2, 0);
			var v3 = Adp.Vec3.create(-x2, -y2, 0);
			var v4 = Adp.Vec3.create(+x2, -y2, 0);
			return [
				v1[0], v1[1], v1[2],
				v2[0], v2[1], v2[2],
				v3[0], v3[1], v3[2],
				v4[0], v4[1], v4[2]
			];
		})()
	);

  	// parameter
	this.setPosition(position);
	this.setColor(color);
	this.setScale(Adp.Vec3.create(scale, scale, scale));
	this.setIndex([0, 2, 1, 1, 2, 3]);
	this.setVertexCount(4);
	this.setLocalPositionVertices(this.polygon.getVertices());
}
// inherits class
Util.inherits(Square, ObjectBase);

Square.prototype.getNormal = function getNormal()
{
	var m = Adp.Mtx4.identity();
	// transform the rotate
	var r = this.getRotate();
	if (r != null)
		Adp.Mtx4.rotate(m, m, r.rad, r.axis);
	// apply the rotate matrix to position
	var new_vec = [];
	var tmp = Adp.Vec3.create();
	$.each(Util.convertArraySingle2Vec3(this.polygon.getVertices()), function() {
		Adp.Mtx4.multiplyVec3(tmp, m, this);
    	new_vec.push(tmp[0], tmp[1], tmp[2]);
	});
	// calculate normal
	return Util.calculateNormal(new_vec);
}
Square.prototype.getVBOAttributes = function getVBOAttributes()
{
	var n = this.getNormal();
	return [this.polygon.getVertices(),
	 		Util.increaseArrayElement(n, 4),
	 		Util.increaseArrayElement(this.getColor(), 4)];
}
Square.prototype.draw = function draw(gl, shader, matrices, opt)
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
	gl.drawElements(gl.TRIANGLES, this.getIndex().length, gl.UNSIGNED_SHORT, 0);
} 
Square.prototype.drawForObjectPicking = function drawForObjectPicking(gl, shader, matrices)
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
	gl.drawElements(gl.TRIANGLES, this.getIndex().length, gl.UNSIGNED_SHORT, 0);
} 

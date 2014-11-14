//
// Sphere
//
function Sphere(position, color, scale, shaderId)
{
  	// parent class
  	ObjectBase.call(this, shaderId)

	// sphere
	this.sphere = Adp.Util.createSphere(64, 64, 1.0, color);
	
	// parameter
	this.setPosition(position);
	this.setColor(color);
	this.setScale([scale, scale, scale]);
	this.setIndex(this.sphere.i);

}
// inherits class
Util.inherits(Sphere, ObjectBase);

Sphere.prototype.getVBOParameters = function getVBOParameters() {
	return [this.sphere.p, 
			this.sphere.n, 
			Util.increaseArrayElement(this.color, this.getIndex().length)];
}

Sphere.prototype.draw = function draw(gl, mMatrix, vMatrix, pMatrix, vpMatrix, shader, opt){

	Adp.Mtx4.translate(mMatrix, mMatrix, this.getPosition());
	Adp.Mtx4.scale(mMatrix, mMatrix, this.getScale());
	Adp.Mtx4.multiply(mMatrix, vpMatrix, mMatrix);
	shader.setMVPMatrix(gl, mMatrix);
	shader.setDirectionLight(gl, Global.LIGHT_DIRECTION);
	shader.setAmbientColor(gl, opt.selected ? Global.AMBIENT_COLOR_SELECTED : Global.AMBIENT_COLOR);
	shader.setIsUseLight(gl, true);
	shader.setIsObjectPicking(gl, false);
	gl.drawElements(gl.TRIANGLES, this.getIndex().length, gl.UNSIGNED_SHORT, 0);
} 

Sphere.prototype.drawForObjectPicking = function drawForObjectPicking(
	objectManager, 
	gl, 
	mMatrix, 
	vMatrix, 
	pMatrix, 
	vpMatrix, 
	shader, 
	opt){

	Adp.Mtx4.translate(mMatrix, mMatrix, this.getPosition());
	Adp.Mtx4.scale(mMatrix, mMatrix, this.getScale());
	Adp.Mtx4.multiply(mMatrix, vpMatrix, mMatrix);
	shader.setMVPMatrix(gl, mMatrix);
	shader.setIsUseLight(gl, false);
	shader.setIsObjectPicking(gl, true);
	shader.setObjectColor(gl, objectManager.generateColor(opt.id));
	gl.drawElements(gl.TRIANGLES, this.getIndex().length, gl.UNSIGNED_SHORT, 0);
} 

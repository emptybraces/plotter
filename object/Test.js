function Test()
{
	this.localPosition = [
		0.0, 5.0, 0.0,
		5.0, 0.0, 0.0,
		-5.0, 0.0, 0.0
		];
	this.position = [0, 0, 0];
	this.index = [0, 2, 1];
	this.color = [1.0, 1.0, 1.0, 1.0];
	this.shaderId ="shader_obj";
	this.isNeedUpdateVBO = false;
	this.scale = [1.0, 1.0, 1.0];
}

Test.prototype.getPosition = function getPosition(){
	return this.position;
}
Test.prototype.setPosition = function setPosition(position){
	this.position = position;
	return this;
}
Test.prototype.getIndex = function getIndex() {
	return this.index;
}
Test.prototype.getLength = function getLength() {
	return this.index.length;
}
Test.prototype.getShaderId = function getShaderId() {
	return this.shaderId;
}
Test.prototype.getScale = function getScale() {
	return this.scale;
}
Test.prototype.setScale = function setScale(scale) {
	this.scale = scale;
	return this;
}
//
// need update to parameters of vertex buffer object 
//
Test.prototype.isUpdate = function isUpdate(is)
{
	if (is) {
		this.isNeedUpdateVBO = is;
		return this;
	}
	return this.isNeedUpdateVBO; 
}

Test.prototype.getVBOParameters = function getVBOParameters() {
	var c = 1.0;
	var cc = [c, c, c, c, c, c, c, c, c, c, c, c];
	return [this.localPosition, this.localPosition, cc];
}

Test.prototype.draw = function draw(gl, mMatrix, vMatrix, pMatrix, vpMatrix, shader, opt){

	Adp.Mtx4.translate(mMatrix, mMatrix, this.getPosition());
	Adp.Mtx4.scale(mMatrix, mMatrix, this.getScale());
	Adp.Mtx4.multiply(mMatrix, vpMatrix, mMatrix);
	shader.setMVPMatrix(gl, mMatrix);
	shader.setIsUseLight(gl, false);
	shader.setIsObjectPicking(gl, false);
	gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
	// gl.drawArrays(gl.TRIANGLES, 0, 3);
} 


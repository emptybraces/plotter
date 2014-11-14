//
// ShaderLine
//
function ShaderLine(gl, program) {

    this.attributeLocation = []
    this.attributeLocation[0] = gl.getAttribLocation(program, 'position');
    this.attributeLocation[1] = gl.getAttribLocation(program, 'color');
	this.attributeStride = [];
    this.attributeStride[0] = 3;
    this.attributeStride[1] = 4;
	this.uniformLocation = [];
    this.uniformLocation[0] = gl.getUniformLocation(program, 'mvpMatrix');
	this.program = program;

}

ShaderLine.prototype.getAttributeLocation = function getAttributeLocation()
{
	return this.attributeLocation;
}
ShaderLine.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
ShaderLine.prototype.getUniformLocation = function getUniformLocation()
{
	return this.uniformLocation;
}
ShaderLine.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderLine.prototype.setMVPMatrix = function setMVPMatrix(gl, matrix)
{
	gl.uniformMatrix4fv(this.getUniformLocation()[0], false, matrix);
}

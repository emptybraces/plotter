//
// ShaderPoint
//
function ShaderPoint(gl, program) {

    this.attributeLocation = []
    this.attributeLocation[0] = gl.getAttribLocation(program, 'position');
    this.attributeLocation[1] = gl.getAttribLocation(program, 'color');
	this.attributeStride = [];
    this.attributeStride[0] = 3;
    this.attributeStride[1] = 4;
	this.uniformLocation = [];
    this.uniformLocation[0] = gl.getUniformLocation(program, 'mvpMatrix');
    this.uniformLocation[1] = gl.getUniformLocation(program, 'pointSize');
    this.uniformLocation[2] = gl.getUniformLocation(program, 'isObjectPicking');
    this.uniformLocation[3] = gl.getUniformLocation(program, 'objectColor');
	this.program = program;

}

ShaderPoint.prototype.getAttributeLocation = function getAttributeLocation()
{
	return this.attributeLocation;
}
ShaderPoint.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
ShaderPoint.prototype.getUniformLocation = function getUniformLocation()
{
	return this.uniformLocation;
}
ShaderPoint.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderPoint.prototype.setMVPMatrix = function setMVPMatrix(gl, matrix)
{
	gl.uniformMatrix4fv(this.getUniformLocation()[0], false, matrix);
}
ShaderPoint.prototype.setPointSize = function setPointSize(gl, pointSize)
{
	gl.uniform1f(this.getUniformLocation()[1], pointSize);
}
ShaderPoint.prototype.setIsObjectPicking = function setIsObjectPicking(gl, is)
{
    gl.uniform1i(this.getUniformLocation()[2], is);
}
ShaderPoint.prototype.setObjectColor = function setObjectColor(gl, color)
{
    gl.uniform4fv(this.getUniformLocation()[3], color);
}

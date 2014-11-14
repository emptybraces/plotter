//
// ShaderBoundary
//
function ShaderBoundary(gl, program) {

    this.attributeLocation = []
    this.attributeLocation[0] = gl.getAttribLocation(program, 'position');
	this.attributeStride = [];
    this.attributeStride[0] = 3;
	this.uniformLocation = [];
    this.uniformLocation[0] = gl.getUniformLocation(program, 'mvpMatrix');
    this.uniformLocation[1] = gl.getUniformLocation(program, 'objectColor');
	this.program = program;

}

ShaderBoundary.prototype.getAttributeLocation = function getAttributeLocation()
{
	return this.attributeLocation;
}
ShaderBoundary.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
ShaderBoundary.prototype.getUniformLocation = function getUniformLocation()
{
	return this.uniformLocation;
}
ShaderBoundary.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderBoundary.prototype.setMVPMatrix = function setMVPMatrix(gl, matrix)
{
	gl.uniformMatrix4fv(this.getUniformLocation()[0], false, matrix);
}
ShaderBoundary.prototype.setObjectColor = function setObjectColor(gl, color)
{
    gl.uniform4fv(this.getUniformLocation()[1], color);
}
ShaderBoundary.prototype.setUniforms = function setUniforms(gl, uniforms)
{
    this.setMVPMatrix(gl, uniforms[0]);
    this.setObjectColor(gl, uniforms[1]);
}

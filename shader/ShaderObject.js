function ShaderObject(gl, program, args) {

    this.attributeLocation = []
    this.attributeLocation[0] = gl.getAttribLocation(program, 'position');
    this.attributeLocation[1] = gl.getAttribLocation(program, 'normal');
    this.attributeLocation[2] = gl.getAttribLocation(program, 'color');
	this.attributeStride = [];
    this.attributeStride[0] = 3;
    this.attributeStride[1] = 3;
    this.attributeStride[2] = 4;
	this.uniformLocation = [];
    this.uniformLocation[0] = gl.getUniformLocation(program, 'mvpMatrix');
    this.uniformLocation[1] = gl.getUniformLocation(program, 'lightDirection');
    this.uniformLocation[2] = gl.getUniformLocation(program, 'ambientColor');
    this.uniformLocation[3] = gl.getUniformLocation(program, 'isUseLight');
	this.program = program;

    var useTexture = args[0];
    if (useTexture === true) {
        this.attributeLocation[3]   = gl.getAttribLocation(program, 'textureCoord');
        this.attributeStride[3]     = 2;
        this.uniformLocation[4]     = gl.getUniformLocation(program, 'uSampler');
    }
}

ShaderObject.prototype.getAttributeLocation = function getAttributeLocation()
{
	return this.attributeLocation;
}
ShaderObject.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
ShaderObject.prototype.getUniformLocation = function getUniformLocation()
{
	return this.uniformLocation;
}
ShaderObject.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderObject.prototype.setMVPMatrix = function setMVPMatrix(gl, matrix)
{
	gl.uniformMatrix4fv(this.getUniformLocation()[0], false, matrix);
}
ShaderObject.prototype.setDirectionLight = function setDirectionLight(gl, direction)
{
	gl.uniform3fv(this.getUniformLocation()[1], direction);
}
ShaderObject.prototype.setAmbientColor = function setAmbientColor(gl, ambient)
{
    gl.uniform4fv(this.getUniformLocation()[2], ambient);
}
ShaderObject.prototype.setIsUseLight = function setIsUseLight(gl, use)
{
    gl.uniform1i(this.getUniformLocation()[3], use);
}
ShaderObject.prototype.setSampler = function setSampler(gl, unit)
{
    gl.uniform1i(this.getUniformLocation()[4], unit);
}

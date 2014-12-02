//
// ShaderBoundary
//
function ShaderBoundary(program) {
    // attribute locations
    this.attributeLocations = Adp.GL.getAttributeLocations(program, ["position"]);
    // attribute stride
	this.attributeStride    = [3];
    // uniform locations
    this.uniformLocations   = Adp.GL.getUniformLocations(program, ["mvpMatrix", "objectColor"]);
    // program object
	this.program = program;
}

ShaderBoundary.prototype.getAttributeLocations = function getAttributeLocations()
{
	return this.attributeLocations;
}
ShaderBoundary.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
ShaderBoundary.prototype.getUniformLocations = function getUniformLocations()
{
	return this.uniformLocations;
}
ShaderBoundary.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderBoundary.prototype.setMVPMatrix = function setMVPMatrix(matrix)
{
    Adp.GL.uniformMatrix4fv(this.uniformLocations[0], matrix);
}
ShaderBoundary.prototype.setObjectColor = function setObjectColor(color)
{
    Adp.GL.uniform4fv(this.uniformLocations[1], color);
}

//
// ShaderLine class
//
function ShaderLine(program) {
	// attribute locatoins
    this.attributeLocations = Adp.GL.getAttributeLocations(program, ["position", "color"]);
    // attribute stride
	this.attributeStride 	= [3, 4];
	// uniform locations
	this.uniformLocations   = Adp.GL.getUniformLocations(program, ["mvpMatrix"]);
	// program object
	this.program = program;

}

ShaderLine.prototype.getAttributeLocations = function getAttributeLocations()
{
	return this.attributeLocations;
}
ShaderLine.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
ShaderLine.prototype.getUniformLocations = function getUniformLocations()
{
	return this.uniformLocations;
}
ShaderLine.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderLine.prototype.setMVPMatrix = function setMVPMatrix(matrix)
{
	Adp.GL.uniformMatrix4fv(this.uniformLocations[0], matrix);
}

//
// Shader2DPlane
//
function Shader2DPlane(program) {
    // attribute locations
    this.attributeLocations = Adp.GL.getAttributeLocations(program, ["position", "textureCoord"]);
    // attribute stride
	this.attributeStride    = [2, 2];
    // uniform locations
    this.uniformLocations   = Adp.GL.getUniformLocations(program, ["uColor", "uSampler"]);
    // program object
	this.program = program;
}

Shader2DPlane.prototype.getAttributeLocations = function getAttributeLocations()
{
	return this.attributeLocations;
}
Shader2DPlane.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
Shader2DPlane.prototype.getUniformLocations = function getUniformLocations()
{
	return this.uniformLocations;
}
Shader2DPlane.prototype.getProgram = function getProgram()
{
    return this.program;
}
Shader2DPlane.prototype.setColor = function setColor(color)
{
    Adp.GL.uniform4fv(this.uniformLocations[0], color);
}
Shader2DPlane.prototype.setSampler = function setSampler(unit)
{
    Adp.GL.uniform1i(this.uniformLocations[1], unit);
}

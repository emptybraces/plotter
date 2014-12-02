//
// ShaderObject class
//
function ShaderObject(program) {
    // attribute locations
    this.attributeLocations = Adp.GL.getAttributeLocations(program, ["position", "normal", "color"]);
    // attribute stride
	this.attributeStride    = [3, 3, 4];
    // uniform locations 
	this.uniformLocations   = Adp.GL.getUniformLocations(program
        , ["mvpMatrix", "lightDirection", "ambientColor", "isUseLight"]);
    // program
	this.program = program;
}

ShaderObject.prototype.getAttributeLocations = function getAttributeLocations()
{
	return this.attributeLocations;
}
ShaderObject.prototype.getAttributeStride = function getAttributeStride()
{
	return this.attributeStride;
}
ShaderObject.prototype.getUniformLocations = function getUniformLocations()
{
	return this.uniformLocations;
}
ShaderObject.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderObject.prototype.setMVPMatrix = function setMVPMatrix(matrix)
{
	Adp.GL.uniformMatrix4fv(this.uniformLocations[0], matrix);
}
ShaderObject.prototype.setDirectionLight = function setDirectionLight(direction)
{
	Adp.GL.uniform3fv(this.uniformLocations[1], direction);
}
ShaderObject.prototype.setAmbientColor = function setAmbientColor(ambient)
{
    Adp.GL.uniform4fv(this.uniformLocations[2], ambient);
}
ShaderObject.prototype.setIsUseLight = function setIsUseLight(boolian)
{
    Adp.GL.uniform1i(this.uniformLocations[3], boolian);
}

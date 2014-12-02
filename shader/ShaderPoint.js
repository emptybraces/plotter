//
// ShaderPoint class
//
function ShaderPoint(program) {
    // attribute locations
    this.attributeLocations = Adp.GL.getAttributeLocations(program, ["position", "color"]);
    // attribute stride
    this.attributeStride    = [3, 4];
    // uniform locations 
    this.uniformLocations   = Adp.GL.getUniformLocations(program
        , ["mvpMatrix", "pointSize", "isObjectPicking", "objectColor"]);
    // program
    this.program = program;
}

ShaderPoint.prototype.getAttributeLocations = function getAttributeLocations()
{
    return this.attributeLocations;
}
ShaderPoint.prototype.getAttributeStride = function getAttributeStride()
{
    return this.attributeStride;
}
ShaderPoint.prototype.getUniformLocations = function getUniformLocations()
{
    return this.uniformLocations;
}
ShaderPoint.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderPoint.prototype.setMVPMatrix = function setMVPMatrix(matrix)
{
    Adp.GL.uniformMatrix4fv(this.uniformLocations[0], matrix);
}
ShaderPoint.prototype.setPointSize = function setPointSize(pointSize)
{
	Adp.GL.uniform1f(this.uniformLocations[1], pointSize);
}
ShaderPoint.prototype.setIsObjectPicking = function setIsObjectPicking(boolean)
{
    Adp.GL.uniform1i(this.uniformLocations[2], boolean);
}
ShaderPoint.prototype.setObjectColor = function setObjectColor(color)
{
    Adp.GL.uniform4fv(this.uniformLocations[3], color);
}

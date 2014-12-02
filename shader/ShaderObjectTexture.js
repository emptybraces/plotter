//
// ShaderObject class
//
function ShaderObjectTexture(program) {
    // attribute locations
    this.attributeLocations = Adp.GL.getAttributeLocations(program
        , ["position", "normal", "color", "textureCoord"]);
    // attribute stride
    this.attributeStride    = [3, 3, 4, 2];
    // uniform locations 
    this.uniformLocations   = Adp.GL.getUniformLocations(program
        , ["mvpMatrix", "lightDirection", "ambientColor", "isUseLight", "uSampler"]);
    // program
    this.program = program;
}

ShaderObjectTexture.prototype.getAttributeLocations = function getAttributeLocations()
{
    return this.attributeLocations;
}
ShaderObjectTexture.prototype.getAttributeStride = function getAttributeStride()
{
    return this.attributeStride;
}
ShaderObjectTexture.prototype.getUniformLocations = function getUniformLocations()
{
    return this.uniformLocations;
}
ShaderObjectTexture.prototype.getProgram = function getProgram()
{
    return this.program;
}
ShaderObjectTexture.prototype.setMVPMatrix = function setMVPMatrix(matrix)
{
    Adp.GL.uniformMatrix4fv(this.uniformLocations[0], matrix);
}
ShaderObjectTexture.prototype.setDirectionLight = function setDirectionLight(direction)
{
    Adp.GL.uniform3fv(this.uniformLocations[1], direction);
}
ShaderObjectTexture.prototype.setAmbientColor = function setAmbientColor(ambient)
{
    Adp.GL.uniform4fv(this.uniformLocations[2], ambient);
}
ShaderObjectTexture.prototype.setIsUseLight = function setIsUseLight(boolian)
{
    Adp.GL.uniform1i(this.uniformLocations[3], boolian);
}
ShaderObjectTexture.prototype.setSampler = function setSampler(unit)
{
    Adp.GL.uniform1i(this.uniformLocations[4], unit);
}

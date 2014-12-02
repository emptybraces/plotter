//
// GLBuffer class
//
function GLBuffer()
{
	/// parameter
	this.vbo 	= null;
	this.ibo	= null;
	this.index 	= null;
}
//
// creates a vertex buffer object
//
GLBuffer.prototype.createVBO = function createVBO(attributes)
{
	// intialize
	this.vbo = [];
	// sets a data
	attributes.forEach(function(elem){
	    // creates a vertex buffer
	    // attributes are assumed to be flatten values.
	    var buffer = Adp.GL.createVertexBuffer(elem);
	    this.vbo.push(buffer);
	}, this);
}
//
// updates a vertex buffer object
//
GLBuffer.prototype.updateVBO = function updateVBO(attributes)
{
	Util.forEachMultiple([this.vbo, attributes], function(vbo, attribute){
		Adp.GL.updateVertexBuffer(vbo, attribute);
	});
}
//
// create index buffer object
//
GLBuffer.prototype.createIBO = function createIBO(indices)
{
	this.ibo = Adp.GL.createIndexBuffer(indices);
}
//
// sets a attribute parameter to shader
//
GLBuffer.prototype.bindAttribute = function bindAttribute(locations, strides)
{
	Util.forEachMultiple([this.vbo, locations, strides], function(vbo, location, stride){
		if (location == null || stride == null || vbo == null)
			return;
		Adp.GL.bindAttribute(vbo, location, stride);
    });
}

//
// GLBuffer class
//
function GLBuffer()
{
	// parameter initialize
	this.vbo 	= null;
	this.ibo	= null;
	this.index 	= null;
}
//
// create vertex buffer object
//
GLBuffer.prototype.createVBO = function createVBO(gl, attributes)
{
	this.vbo = [];
	attributes.forEach(function(elem){
	    // バッファオブジェクトの生成
	    var vbo = gl.createBuffer();
	    // バッファをバインドする
	    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	    // バッファにデータをセット
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(elem), gl.STATIC_DRAW);
	    // バッファのバインドを無効化
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	    this.vbo.push(vbo);
	}, this);
}
//
// update vertex buffer object
//
GLBuffer.prototype.updateVBO = function updateVBO(gl, attributes)
{
	Util.forEachMultiple([this.vbo, attributes], function(vbo, attribute){
	    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attribute), gl.STATIC_DRAW);
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	});
}
//
// create index buffer object
//
GLBuffer.prototype.createIBO = function createIBO(gl, indices)
{
    // バッファオブジェクトの生成
    this.ibo = gl.createBuffer();
    // バッファをバインドする
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    // バッファにデータをセット
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indices), gl.STATIC_DRAW);
    // バッファのバインドを無効化
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
//
// set shader's attribute parameter
//
GLBuffer.prototype.setAttribute = function setAttribute(gl, locations, strides)
{
	Util.forEachMultiple([this.vbo, locations, strides], function(vbo, location, stride){
		if (vbo == null || location == null || stride == null)
			return;
        // バッファをバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        // attributeLocationを有効にする
        gl.enableVertexAttribArray(location);
        // attributeLocationを通知し登録する
        gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
    });
    // bind ibo
    this.setIndexBuffer(gl);
}
//
// set index buffer object
//
GLBuffer.prototype.setIndexBuffer = function setIndexBuffer(gl)
{
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
}
//
//
// active texture
//
GLBuffer.prototype.setTexture = function setTexture(gl, texture, unit)
{
	gl.activeTexture(gl.TEXTURE0 + unit);
	gl.bindTexture(gl.TEXTURE_2D, texture);
}

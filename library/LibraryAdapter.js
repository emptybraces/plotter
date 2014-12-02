//
// Library Adapter Class
//
var Adp = {};

Adp.Mtx4 = {
	// create
	// identity
	// clone
	// multiply
	// translate
	// scale
	// rotate
	// lookat
	// perspective 
	// multiplyVec3
	// multiplyVec4
	create : function create()
	{
		return mat4.create();
	},
	identity : function identity(out) {
		if (!out)
			return mat4.identity(mat4.create());
		return mat4.identity(out);
	},
	clone : function clone(src){
		return mat4.clone(src);
	},
	multiply : function multiply(out, a, b){
		return mat4.multiply(out, a, b);
	},
	translate : function translate(out, m, v){
		return mat4.translate(out, m, v);
	},
	scale : function scale(out, m, s){
		return mat4.scale(out, m, s);
	},
	rotate : function rotate(out, m, rad, axis){
		return mat4.rotate(out, m, rad, axis);
	},
	lookAt : function lookAt(out, eye, target, up) {
		return mat4.lookAt(out, eye, target, up);
	},
	perspective : function perspective(out, fovy, aspect, near, far) {
		return mat4.perspective(out, fovy, aspect, near, far);
	},
	invert : function invert(out, src) {
		return mat4.invert(out, src)
	},
	multiplyVec3 : function multiplyVec3(out, m, v) {
		if (arguments.length == 2)
			return vec3.transformMat4(Adp.Vec3.create(), m, out);
		return vec3.transformMat4(out, v, m);
	},
	multiplyVec4 : function multiplyVec4(out, m, v) {
		if (arguments.length == 2)
			return vec4.transformMat4(Adp.Vec4.create(), m, out);
		return vec4.transformMat4(out, v, m);
	},
	transpose : function transpose(out, m) {
		return mat4.transpose(out, m);
	},
	fromRotationTranslation : function fromRotationTranslation(out, q, v){
		return mat4.fromRotationTranslation(out, q, v);
	},
	billboardY : function billboardY(out, m, position, front) {
		// object to target vector
		var obj2Eye_xz = Adp.Vec3.subtract(CameraManager.position(), position);
		// xz-plane
		obj2Eye_xz[1] = 0;
		// make quaternion to the camera position vector from the front vector of objects 
		var q = Adp.Quat.identity();
		Adp.Quat.rotationTo(q, front, Adp.Vec3.normalize(obj2Eye_xz));
		// reflect the quaternion to matrix
		Adp.Mtx4.fromRotationTranslation(m, q, position);
	},
	billboard : function billboard(out, p, v, m) {
		var viewTranspose = Adp.Mtx4.identity();
		Adp.Mtx4.transpose(viewTranspose, v);
		// disable the translate 
		viewTranspose[3] = 0;
		viewTranspose[7] = 0;
		viewTranspose[11] = 0;
		viewTranspose[15] = 1;
		Adp.Mtx4.multiply(out, m, viewTranspose);
	}
};

Adp.Quat = {
	// create
	// identity
	// rotate
	// toVec3
	// clone
	// rotationTo
	create : function create() {
		return quat.create();
	},
	identity : function identity(out){
		if (arguments.length == 0) 
			return quat.identity(quat.create());
		return quat.identity(out);
	},
	rotate : function rotate(out, axis, rad){
		return quat.setAxisAngle(out, axis, rad);
	},
	toVec3 : function toVec3(out, v, q) {
		return vec3.transformQuat(out, v, q);
	},
	clone : function clone(src) {
		return quat.clone(src);
	},
	rotationTo : function rotationTo(out, a, b) {
		return quat.rotationTo(out, a, b);
	}
};

Adp.Vec2 = {
	// create
	// length
	// negate
	// dot
	// rotationTo
	create : function create(x, y) {
		var x_ = 0, y_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		return vec2.fromValues(x_, y_);
	},
	length : function length(a) {
		return vec2.length(a);
	},
	negate : function negate(out, a) {
		if (arguments.length == 1) 
			return [-out[0], -out[1]];
		return vec2.nagete(out, a);
	},
	dot : function dot(a, b) {
		return vec2.dot(a, b);
	},
	rotationTo : function rotationTo(a, b) {
		var d = this.dot(a, b);
		if (d == 0)
			return Math.PI/2;
		var na = this.length(a);
		var nb = this.length(b);
		var r = na * nb;
		if (r > 0)
			return Math.acos(d / r);
		else
			return 0;
	},
}

Adp.Vec3 = {
	// create
	// scale
	// crone
	// normalize
	// subtract
	// negate
	// dot
	// cross
	// rotateX
	// rotateY
	// rotateZ
	// rotationTo
	create : function create(x, y, z) {
		var x_ = 0, y_ = 0, z_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		if (!Util.isUndefined(z)) z_ = z;
		return vec3.fromValues(x_, y_, z_);
	},
	scale : function scale(out, a, b) {
		if (arguments.length == 3)
			return vec3.scale(out, a, b);
		return [out[0]*a, out[1]*a, out[2]*a];
	},
	clone : function clone(a) {
		return vec3.clone(a);
	},
	normalize : function normalize(v) {
		return vec3.normalize(v, v);
	},
	subtract : function subtract(out, a, b) {
		if (arguments.length == 2) 
			return [out[0] - a[0], out[1] - a[1], out[2] - a[2]];
		return vec3.subtract(out, a, b);
	},
	negate : function negate(out, a) {
		if (arguments.length == 1) 
			return [-out[0], -out[1], -out[2]];
		return vec3.nagete(out, a);
	},
	dot : function dot(a, b) {
		return vec3.dot(a, b);
	},
	cross : function cross(out, a, b) {
		return vec3.cross(out, a, b);
	},
	rotateX : function rotateX(out, pt, origin, rad) {
		return vec3.rotateX(out, pt, origin, rad);
	},
	rotateY : function rotateY(out, pt, origin, rad) {
		return vec3.rotateY(out, pt, origin, rad);
	},
	rotateZ : function rotateZ(out, pt, origin, rad) {
		return vec3.rotateZ(out, pt, origin, rad);
	},
	length : function length(a) {
		return vec3.length(a);
	},
	rotationTo : function rotationTo(a, b) {
		var d = this.dot(a, b);
		if (d == 0)
			return Math.PI/2;
		var na = this.length(a);
		var nb = this.length(b);
		var r = na * nb;
		console.log(Math.acos(d / r) * Util.RAD2DEG, a, b, d)
		if (r > 0)
			return Math.acos(d / r);
		else
			return 0;
	},
};

Adp.Vec4 = {
	// create
	create : function create(x, y, z, w) {
		var x_ = 0, y_ = 0, z_ = 0, w_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		if (!Util.isUndefined(z)) z_ = z;
		if (!Util.isUndefined(w)) w_ = w;
		return vec4.fromValues(x_, y_, z_, w_);
	},
}

Adp.GL = {
	// createShader
	createShader : function createShader(attributeType, shaderSource) {
		var gl = CommonManager.getGLContext();
        // scriptタグのtype属性をチェック
        switch(attributeType){
            // 頂点シェーダの場合
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            // フラグメントシェーダの場合
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                Util.error("invalid type attribute in script element");
                return null;
        }
        // 生成されたシェーダにソースを割り当てる
        gl.shaderSource(shader, shaderSource);
        // シェーダをコンパイルする
        gl.compileShader(shader);
        // シェーダが正しくコンパイルされたかチェック
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            // 成功していたらシェーダを返して終了
            return shader;
        }
        // 失敗していたらエラーログをアラートする
        Util.error(gl.getShaderInfoLog(shader));
        return null;
	},
	//
	attachShaders2Program : function attachShaders2Program(vertexShader, fragmentShader) {
		var gl = CommonManager.getGLContext();
       	// プログラムオブジェクトの生成
        var program = gl.createProgram();
        // プログラムオブジェクトにシェーダを割り当てる
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // シェーダをリンク
        gl.linkProgram(program);
        // シェーダのリンクが正しく行なわれたかチェック
        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
            // 成功していたらプログラムオブジェクトを有効にする
            // this.gl.useProgram(program);
            // プログラムオブジェクトを返して終了
            return program;
        }else{
            // 失敗していたらエラーログをアラートする
            Util.error(this.gl.getProgramInfoLog(program));
            return null;
        }
	},
	// creates a vertex buffer
	createVertexBuffer : function createVertexBuffer(flattenValues)
	{
		var gl = CommonManager.getGLContext();
	    // create a buffer
	    var buffer = gl.createBuffer();
	    // bind
	    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	    // sets a data
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flattenValues), gl.STATIC_DRAW);
	    // release
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	    return buffer;
	},
	// updates a vertex buffer
	updateVertexBuffer : function updateVertexBuffer(buffer, flattenValues)
	{
		var gl = CommonManager.getGLContext();
	    // bind
	    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	    // sets a data
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flattenValues), gl.STATIC_DRAW);
	    // release
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	    return buffer;
	},
	// creates a index buffer
	createIndexBuffer : function createIndexBuffer(indices)
	{
		var gl = CommonManager.getGLContext();
	    // create a buffer
	    var buffer = gl.createBuffer();
	    // bind
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
	    // sets a data
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indices), gl.STATIC_DRAW);
	    // release
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	    return buffer;
	},
	// bind a vertex attribute
	bindAttribute : function bindAttribute(vbo, location, stride)
	{
		var gl = CommonManager.getGLContext();
		// bind
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        // attributeLocationを有効にする
        gl.enableVertexAttribArray(location);
        // attributeLocationを通知し登録する
        gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
	},
	// bind a index buffer
	bindIndex : function bindIndex(ibo)
	{
		var gl = CommonManager.getGLContext();
		// bind
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	},
	// create the texture object
	createTexture : function createTexture(imageElement)
	{
		var gl = CommonManager.getGLContext();
		// create texture
		var texture = gl.createTexture();
		// bind
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// loads a texture
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageElement);
		// sets a texture parameter
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		// mipmap
		gl.generateMipmap(gl.TEXTURE_2D);
		// release
		gl.bindTexture(gl.TEXTURE_2D, null);
		return texture;
	},
	// bind a texture
	bindTexture : function bindTexture(texture, unit)
	{
		var gl = CommonManager.getGLContext();
		gl.activeTexture(gl.TEXTURE0 + unit);
		gl.bindTexture(gl.TEXTURE_2D, texture);
	},
	// enable the specified program object 
	useProgram : function useProgram(program) {
		var gl = CommonManager.getGLContext();
		gl.useProgram(program);
	},
	// set the viewport as resizing the webgl context
	viewport : function viewport(x, y, w, h){
		var gl = CommonManager.getGLContext();
		gl.viewport(x, y, w, h);
	},
	// create the frame buffer that can be used as off-screen surface
	// attached to depth attribute
	createFrameBufferWithDepth : function createFrameBufferWithDepth() {
		var gl = CommonManager.getGLContext();
		// create the frame buffer
    	var frame_buffer = gl.createFramebuffer();
	    gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
	    // create the depth buffer
	    var depth_buffer = gl.createRenderbuffer();
	    gl.bindRenderbuffer(gl.RENDERBUFFER, depth_buffer);
	    // allocate the depth buffer
	    gl.renderbufferStorage(
	          gl.RENDERBUFFER,
	          gl.DEPTH_COMPONENT16,
	          CommonManager.getClientWidth(),
	          CommonManager.getClientHeight());  
	    // attaches a depth buffer to currently bound frame buffer
	    gl.framebufferRenderbuffer(
	          gl.FRAMEBUFFER,
	          gl.DEPTH_ATTACHMENT,
	          gl.RENDERBUFFER,
	          depth_buffer);
	    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
	       Util.error("failed to attachment of depth buffer.");
	       return null
	    }
	    // create the color buffer as a depth buffer
	    var color_buffer = gl.createRenderbuffer();
	    gl.bindRenderbuffer(gl.RENDERBUFFER, color_buffer);
	    gl.renderbufferStorage(
	          gl.RENDERBUFFER,
	          gl.RGB565,
	          CommonManager.getClientWidth(),
	          CommonManager.getClientHeight());  
	    gl.framebufferRenderbuffer(
	          gl.FRAMEBUFFER,
	          gl.COLOR_ATTACHMENT0,
	          gl.RENDERBUFFER,
	          color_buffer);
	    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
	       Util.error("failed to attachment of color buffer.");
	       return null
	    }
	    // var t = gl.createTexture();
	    // gl.bindTexture(gl.TEXTURE_2D, t);
	    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, CommonManager.getClientWidth(), CommonManager.getClientHeight(), 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0)
	    // release a buffer
	    // gl.bindTexture(gl.TEXTURE_2D, null);
	    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		return frame_buffer;
	},
	// bind the frame buffer
	bindFramebuffer : function bindFramebuffer(frameBuffer) {
		var gl = CommonManager.getGLContext();
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	},
	// clear the framebuffer that was currently bound
	clear : function clear(color, depth, stencil) {
		var gl = CommonManager.getGLContext();
		var clear_bit = 0;
		if (null != color) {
			gl.clearColor(color[0], color[1], color[2], color[3]);
			clear_bit |= gl.COLOR_BUFFER_BIT;
		}
		if (null != depth) {
			gl.clearDepth(depth);
			clear_bit |= gl.DEPTH_BUFFER_BIT;
		}
		if (null != stencil) {
			gl.clearStencil(stencil);
			clear_bit |= gl.STENCIL_BUFFER_BIT;
		}
		gl.clear(clear_bit);
	},
	// create the render buffer
	createRenderbuffer : function createRenderbuffer() {
		var gl = CommonManager.getGLContext();
		return gl.createRenderbuffer();
	},
	// flush the buffer
	flush : function flush() {
		var gl = CommonManager.getGLContext();
		return gl.flush();
	},
	// read a pixel from the frame buffer
	readPixel : function readPixel(scrx, scry) {
		var gl = CommonManager.getGLContext();
		var out = new Uint8Array(4); // rgb
		gl.readPixels(scrx, scry, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, out);
		return out;
	},
	// get location methods
	getAttributeLocations : function getAttributeLocations(program, names) {
		var gl = CommonManager.getGLContext();
		return names.map(function(name){
			return gl.getAttribLocation(program, name);
		});
	},
	getUniformLocations : function getUniformLocations(program, names) {
		var gl = CommonManager.getGLContext();
		return names.map(function(name){
			return gl.getUniformLocation(program, name);
		});
	},
	// set attributes methods
	uniformMatrix4fv : function uniformMatrix4fv(location, matrix) {
		var gl = CommonManager.getGLContext();
		gl.uniformMatrix4fv(location, false, matrix)
	},
	uniform1i : function uniform1i(location, value) {
		var gl = CommonManager.getGLContext();
    	gl.uniform1i(location, value);
	},
	uniform1f : function uniform1f(location, value) {
		var gl = CommonManager.getGLContext();
    	gl.uniform1f(location, value);
	},
	uniform3fv : function uniform3fv(location, vector) {
		var gl = CommonManager.getGLContext();
    	gl.uniform3fv(location, vector);
	},
	uniform4fv : function uniform4fv(location, vector) {
		var gl = CommonManager.getGLContext();
    	gl.uniform4fv(location, vector);
	},
	// draw methods
	drawElements : function drawElements(offset, ibo, indexCount) {
		var gl = CommonManager.getGLContext();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, offset);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	},
	drawTriangles : function drawTriangles(offset, triangleCount) {
		var gl = CommonManager.getGLContext();
		gl.drawArrays(gl.TRIANGLES, offset, triangleCount);
	},
	drawLineStrip : function drawLineStrip(offset, vertexCount) {
		var gl = CommonManager.getGLContext();
		gl.drawArrays(gl.LINE_STRIP, offset, vertexCount);
	},
	drawLines : function drawLines(offset, vertexCount) {
		var gl = CommonManager.getGLContext();
		gl.drawArrays(gl.LINES, offset, vertexCount);
	},
	drawPoints : function drawPoints(offset, vertexCount) {
		var gl = CommonManager.getGLContext();
		gl.drawArrays(gl.POINTS, offset, vertexCount);
	},
}


//
// ModelParts class
//
function ModelParts(gl, shaderId, modelPartsData, option)
{
	// get option
	var shader_option = {
		drawable: undefined,
		uniforms: undefined
	}
	if (!Util.isUndefined(option) && !Util.isUndefined(option.shader)) {
		var idx = Object.keys(option.shader).filter(function(elem) {
			return modelPartsData.geometryName == option.shader[elem].name;
		})[0];
		shader_option = option.shader[idx];
	}

	// shader id
	// console.log(modelPartsData.geometryName)
	var sid = shaderId;
	if (!sid) {
		sid = shader_option.id;
	}
	Util.assert(sid != null, "shader id is null.");
  	// parent class
  	ObjectBase.call(this, sid, true);

  	// parameter
	this.geometryName 		= modelPartsData.geometryName;
	this.geometryData 		= modelPartsData.geometryData;
	this.uniforms			= Util.isUndefined(shader_option.uniforms) ? null : shader_option.uniforms;
	this.textures			= [];
	this.loadCompleted 		= [];
	this.drawable			= Util.isUndefined(shader_option.drawable) ? true : shader_option.drawable;
	// parent parameter
	this.setVertexCount(this.geometryData.position.length/3);

	// load texture 
	var material = this.geometryData.material;
	if (material != null){
		material.imageNames.forEach(function(elem, i){
			var texture = gl.createTexture();
			var image = new Image();
			var loadCompleted = this.loadCompleted;
			image.onload = function() { 
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
				gl.generateMipmap(gl.TEXTURE_2D);
				gl.bindTexture(gl.TEXTURE_2D, null);
				loadCompleted[i] = true;
			}
			image.src = "assets/image/" + elem;
			this.textures.push(texture);
			this.loadCompleted.push(false);
		}, this);
	}
	// parameter
	// Util.fillUndefined(opt, {});
	// this.setPosition(position);
	// this.setColor([1.0, 1.0, 0.0, 1.0]);
	// this.setScale([2, 2, 2]);
	// this.setIndex(this.sphere.i);

}
// inherits class
Util.inherits(ModelParts, ObjectBase);

ModelParts.prototype.getGeometeryName = function getGeometeryName()
{
	return this.geometryName;
}

ModelParts.prototype.isLoadCompleted = function isLoadCompleted()
{
	// return true if loadCompleted is empty
	return this.loadCompleted.every(function(elem){
		return elem;
	});
}
ModelParts.prototype.createVBO = function createVBO(gl)
{
	this.getBuffer().createVBO(gl, this.getVBOAttributes());
}
ModelParts.prototype.updateVBO = function updateVBO(gl)
{
	this.getBuffer().updateVBO(gl, this.getVBOAttributes());
}
ModelParts.prototype.createIBO = function createIBO(gl)
{
}

ModelParts.prototype.getVBOAttributes = function getVBOAttributes()
{
	var geo = this.geometryData;
	var p = geo.position;
	var n = geo.normal;
	if (geo.color == null){
		var c = Util.increaseArrayElement(this.getColor(), this.getVertexCount());
	} else {
		var c = [];
		for(var i = 0, l = geo.color.length/3; i < l; ++i) {
			c.push(geo.color[i*3+0], geo.color[i*3+1], geo.color[i*3+2], 1.0);
		}
	}
	var t = geo.texcoord;
	Util.assert(p.length / this.getVertexCount() == 3, "invalid position length");
	Util.assert(n.length / this.getVertexCount() == 3, "invalid normal length");
	Util.assert(c.length / this.getVertexCount() == 4, "invalid color length");
	Util.assert(t ? t.length / this.getVertexCount() == 2 : true, "invalid texcoord length");
	// return the attributes each shader
	switch(this.getShaderId()) {
		case "shader_obj": 		return [p, n, c];
		case "shader_objtex": 	return [p, n ,c ,t];
		case "shader_boundary": return [p];
	}
}

ModelParts.prototype.draw = function draw(gl, shader, matrices, objOption, option)
{
	if (!this.drawable) 
		return;

	var shader_ = shader;
	if (shader_ == null) {
		shader_ = objOption.shaderObject.switchShader(this.getShaderId());
	}

	// passing the shader paramter
	this.getBuffer().setAttribute(
		gl,
		shader_.getAttributeLocation(), 
		shader_.getAttributeStride());
	// passing the shader parameter
	shader_.setMVPMatrix(gl, matrices.m);
	switch(this.getShaderId()) {
		case "shader_objtex": 
			this.textures.forEach(function(texture, unit){
				this.getBuffer().setTexture(gl, texture, unit);
				shader_.setSampler(gl, unit);
			}, this);
		case "shader_obj": 
			shader_.setDirectionLight(gl, Util.isUndefined(option.lightDirection) ? Global.LIGHT_DIRECTION : option.lightDirection);
			shader_.setAmbientColor(gl, objOption.selected ? Global.AMBIENT_COLOR_SELECTED : Global.AMBIENT_COLOR);
			shader_.setIsUseLight(gl, true);
			break;			
		case "shader_boundary": 
			shader_.setObjectColor(gl, this.uniforms.color);
			gl.drawArrays(gl.LINE_STRIP , 0, this.getVertexCount());
			return;
			break;
	}
	// draw
	gl.drawArrays(gl.TRIANGLES, 0, this.getVertexCount());
} 

ModelParts.prototype.drawForObjectPicking = function drawForObjectPicking(gl, shader, matrices)
{
	if (!this.drawable) 
		return;
	// passing the position shader paramter
	this.getBuffer().setAttribute(
		gl,
		[shader.getAttributeLocation()[0]], 
		[shader.getAttributeStride()[0]]);

	// draw
	gl.drawArrays(gl.TRIANGLES, 0, this.getVertexCount());
} 

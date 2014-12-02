//
// ModelParts class
//
function ModelParts(shaderId, modelPartsData, option)
{
	// gets a shader option
	var shader_option = {
		drawable: undefined,
		uniforms: undefined
	};
	if (!Util.isUndefined(option) && !Util.isUndefined(option.shader)) {
		var idx = Object.keys(option.shader).filter(function(elem) {
			return modelPartsData.geometryName == option.shader[elem].name;
		})[0];
		shader_option = option.shader[idx];
	}

	// shader id
	var sid = shaderId;
	if (!sid) {
		sid = shader_option.id;
	}
	Util.assert(sid != null, "shader id is null.");
  	// parent class
  	ObjectBase.call(this, sid);

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
			var image = new Image();
			var loadCompleted = this.loadCompleted;
			var textures = this.textures;
			image.onload = function() { 
				var texture = Adp.GL.createTexture(this);
				loadCompleted[i] = true;
				textures.push(texture);
			}
			image.src = "assets/image/" + elem;
			this.loadCompleted.push(false);
		}, this);
	}
	// parameter

	// create a buffer object
	this.getBuffer().createVBO(this.getVBOAttributes());
	// ibo

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
ModelParts.prototype.getVBOAttributes = function getVBOAttributes()
{
	var geo = this.geometryData;
	var p = geo.position;
	var n = geo.normal;
	if (geo.color == null){
		var c = Util.increaseElement(this.getColor(), this.getVertexCount());
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

ModelParts.prototype.draw = function draw(shader, matrices, objOption, option)
{
	if (!this.drawable) 
		return;

	var _shader = shader;
	if (_shader == null) {
		_shader = ShaderManager.switchShader(this.getShaderId());
	}

	// passing the shader paramter
	this.getBuffer().bindAttribute(
		_shader.getAttributeLocations(), 
		_shader.getAttributeStride());
	// passing the shader parameter
	_shader.setMVPMatrix(matrices.m);
	switch(this.getShaderId()) {
		case "shader_objtex": 
			this.textures.forEach(function(texture, unit){
				Adp.GL.bindTexture(texture, unit);
				_shader.setSampler( unit);
			}, this);
		case "shader_obj": 
			_shader.setDirectionLight(Util.isUndefined(option.lightDirection) ? CommonManager.LIGHT_DIRECTION : option.lightDirection);
			_shader.setAmbientColor(objOption.selected ? CommonManager.AMBIENT_COLOR_SELECTED : CommonManager.AMBIENT_COLOR);
			_shader.setIsUseLight(true);
			break;			
		case "shader_boundary": 
			_shader.setObjectColor(CommonManager.BOUNDARY_COLOR);
			Adp.GL.drawLineStrip(0, this.getVertexCount());
			return;
			break;
	}
	// draw
	Adp.GL.drawTriangles(0, this.getVertexCount());
} 

ModelParts.prototype.drawForObjectPicking = function drawForObjectPicking(shader, matrices)
{
	if (!this.drawable) 
		return;
	// passing the position shader paramter
	this.getBuffer().bindAttribute(
		[shader.getAttributeLocations()[0]], 
		[shader.getAttributeStride()[0]]);

	// draw
	Adp.GL.drawTriangles(0, this.getVertexCount());
} 

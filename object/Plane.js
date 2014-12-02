//
// Plane class
//
function Plane(shaderId, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, option);

	// polygon
	var sidew = (!Util.isUndefined(option) && !Util.isUndefined(option.sidew)) ? option.sidew : 1;
	var sideh = (!Util.isUndefined(option) && !Util.isUndefined(option.sideh)) ? option.sideh : 1;
	this.polygon = new Polygon(
		(function(){
			var x2 = sidew/2; 
			var y2 = sideh/2;
			var v1 = Adp.Vec3.create(-x2, +y2, 0);
			var v2 = Adp.Vec3.create(+x2, +y2, 0);
			var v3 = Adp.Vec3.create(-x2, -y2, 0);
			var v4 = Adp.Vec3.create(+x2, -y2, 0);
			return [
				v1[0], v1[1], v1[2],
				v2[0], v2[1], v2[2],
				v3[0], v3[1], v3[2],
				v4[0], v4[1], v4[2]
			];
		})()
	);

	// load texture
	this.texture = null;
	if (!Util.isUndefined(option) && !Util.isUndefined(option.image)){
		// var image = new Image();
		// image.onload = function() { 
		// 	gl.bindTexture(gl.TEXTURE_2D, texture);
		// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		// 	gl.generateMipmap(gl.TEXTURE_2D);
		// 	gl.bindTexture(gl.TEXTURE_2D, null);
		// 	loadCompleted[i] = true;
		// }
		// image.src = "assets/image/" + elem;
		// this.textures.push(texture);
		// this.loadCompleted.push(false);
	}
	
	// sets a text canvas
	if (!Util.isUndefined(option) && !Util.isUndefined(option.text)){
		var ctx = ObjectManager.getTextContext();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = "white";
	    ctx.fillText(option.text, 0, 0, 100);
   		this.texture = Adp.GL.createTexture(ObjectManager.getTextCanvas());
	}

  	// initialize
	this.setIndex([0, 2, 1, 1, 2, 3]);
	this.setVertexCount(4);
	this.setLocalPositionVertices(this.polygon.getVertices());
	this.normal = this.polygon.getNormal();
	this.createVBO(this.getVBOAttributes());
	this.createIBO(this.getIndex());

}
// inherits class
Util.inherits(Plane, ObjectBase);
Plane.prototype.getNormal = function getNormal()
{
	return this.normal;
}
Plane.prototype.getVBOAttributes = function getVBOAttributes()
{
	var n = this.getNormal();
	if (this.texture == null) {
		return [this.getLocalPositionVertices(),
		 		Util.increaseElement(n, this.getVertexCount()),
		 		Util.increaseElement(this.getColor(), this.getVertexCount())];
	}
	else {
		// v1 -> v2 -> v3 -> v4
		var t = [0, 0, 1, 0, 0, 1, 1, 1];
		return [this.getLocalPositionVertices(),
		 		Util.increaseElement(n, this.getVertexCount()),
		 		Util.increaseElement(this.getColor(), this.getVertexCount()),
		 		t];
	}
}
Plane.prototype.draw = function draw(shader, matrices, opt)
{
	// calculate the matrix
	switch(this.getBillboardType()){
		case CommonManager.BILLBOARD_TYPE_XYZ:
			Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
			Adp.Mtx4.billboard(matrices.m, matrices.p, matrices.v, matrices.m, matrices.pv);
			Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
			Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
			break;
		case CommonManager.BILLBOARD_TYPE_Y:
			// Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
			Adp.Mtx4.billboardY(matrices.m, matrices.m, this.getPosition(), this.getNormal());
			Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
			Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
			break;
		default:
			var translate = Adp.Mtx4.identity(); 
			var rotate = Adp.Mtx4.identity();
			var scale = Adp.Mtx4.identity();
			Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
			var r = this.getRotate();
			if (r != null) Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
			Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
			Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
			break;
	}
	
	// passing the shader paramter
	if (this.texture != null) {
		Adp.GL.bindTexture(this.texture, 0);
		shader.setSampler(0);
	}
	this.getBuffer().bindAttribute(
		shader.getAttributeLocations(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(matrices.m);
	shader.setDirectionLight( CommonManager.LIGHT_DIRECTION);
	shader.setIsUseLight(true);
	shader.setAmbientColor(opt.selected ? CommonManager.AMBIENT_COLOR_SELECTED : CommonManager.AMBIENT_COLOR);
	// draw
	Adp.GL.drawElements(0, this.getBuffer().ibo, this.getIndex().length);
} 
Plane.prototype.drawForObjectPicking = function drawForObjectPicking(shader, matrices)
{
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null)
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the shader paramter
	this.getBuffer().bindAttribute(
		[shader.getAttributeLocations()[0]], 
		[shader.getAttributeStride()[0]]);
	shader.setMVPMatrix(matrices.m);
	// draw
	Adp.GL.drawElements(0, this.getBuffer().ibo, this.getIndex().length);
} 

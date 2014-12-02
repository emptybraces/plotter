//
// Plane2D class
//
function Plane2D(shaderId, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, option);

	var sidew = (!Util.isUndefined(option) && !Util.isUndefined(option.sidew)) ? option.sidew : 0.5;
	var sideh = (!Util.isUndefined(option) && !Util.isUndefined(option.sideh)) ? option.sideh : 0.5;

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
	this.setLocalPositionVertices((function(thisObj){
		// note:
		// (0, 0) point is center of screen
		// one side length is 2.0 
		// convert a x coordinate(0.0 - +1.0) to (-1.0 - +1.0) 
		// convert a y coordinate(0.0 - +1.0) to (+1.0 - -1.0) 
		
		// upper left point
		var x = Util.lerp(-1.0, 1.0, thisObj.getPosition()[0]);
		var y = Util.lerp(1.0, -1.0, thisObj.getPosition()[1]);
		var w = Util.lerp(0.0, 2.0, sidew);
		var h = Util.lerp(0.0, -2.0, sideh);
		return [
			x, y,			
			x + w, y,		// upper right
			x, y + h,		// lower left
			x + w, y + h, 	// lower right
		];
	})(this));
	this.createVBO(this.getVBOAttributes());
	this.createIBO(this.getIndex());

}
// inherits class
Util.inherits(Plane2D, ObjectBase);

Plane2D.prototype.getVBOAttributes = function getVBOAttributes()
{
	// v1 -> v2 -> v3 -> v4
	var t = [0, 0, 1, 0, 0, 1, 1, 1];
	return [this.getLocalPositionVertices(), t];
}
Plane2D.prototype.draw = function draw(shader, matrices, opt)
{
	// passing the shader paramter
	if (this.texture != null) {
		Adp.GL.bindTexture(this.texture, 0);
		shader.setSampler(0);
	}
	this.getBuffer().bindAttribute(
		shader.getAttributeLocations(), 
		shader.getAttributeStride());
	shader.setColor(this.getColor());
	// draw
	Adp.GL.drawElements(0, this.getBuffer().ibo, this.getIndex().length);
} 

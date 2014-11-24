//
// Plane class
//
function Plane(shaderId, option)
{
  	// parent class
  	ObjectBase.call(this, shaderId, true, option);

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
	if (!Util.isUndefined(option) && !Util.isUndefined(option.text)){
		var gl = option.glctx;
		this.texture = gl.createTexture();
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
	    var textureCanvas = document.getElementById('textureCanvas')
	    var ctx = textureCanvas.getContext('2d');
	    // showcase live rendering by writing the current time
	    var date = new Date();
	    function two(number) {
	        if (number < 10)
	            return '0' + number;
	        else
	            return number;
	    }
	    // var text = two(date.getHours()) + ':' +
	    // two(date.getMinutes()) + ':' +
	    // two(date.getSeconds());
	    // var text = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

	    // // let the color of the box rotate every minute
	    // var secs = date.getSeconds() + date.getMilliseconds() / 1000;
	    // // ctx.fillStyle = 'hsl(' + 360 * (secs / 60) + ',100%,50%)';
	    ctx.fillStyle = "black";
	    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	    // // ctx.fillText(text, 0, 0);
	    // // console.log(ctx.canvas.width, ctx.canvas.height)

	    // // write white text with black border
	    // ctx.fillStyle = 'white';
	    // ctx.lineWidth = 2.5;
	    // ctx.strokeStyle = 'black';
	    // ctx.save();
	    // ctx.font = "30px 'ＭＳ ゴシック'";
	    // ctx.textAlign = 'center';
	    // ctx.textBaseline = 'middle';
	    // var leftOffset = ctx.canvas.width / 2;
	    // var topOffset = ctx.canvas.height / 2;
	    // // ctx.strokeText(text, leftOffset, topOffset);
	    // ctx.fillText(text, leftOffset, topOffset);
	    // ctx.restore();
	    ctx.fillStyle = "white";
	    ctx.font = "30px 'ＭＳ ゴシック'";
	    ctx.textAlign = "left";
	    ctx.textBaseline = "top";
	    ctx.fillText("abcABCあいう漢字", 0, 0, 100);
	    ctx.fillText("abcABCあいう漢字", 0, 30, 100);
	    gl.bindTexture(gl.TEXTURE_2D, this.texture);
		// gl.texImage2D(gl.TEXTURE_2D, 0, textureCanvas);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);

	}

  	// parameter
	this.setIndex([0, 2, 1, 1, 2, 3]);
	this.setVertexCount(4);
	this.setLocalPositionVertices(this.polygon.getVertices());
	this.normal = this.polygon.getNormal();
}
// inherits class
Util.inherits(Plane, ObjectBase);
Plane.prototype.getNormal = function getNormal()
{
	return this.normal;
}
Plane.prototype.calculateNormal = function calculateNormal()
{
	// var m = Adp.Mtx4.identity();
	// // transform the rotate
	// var r = this.getRotate();
	// if (r != null)
	// 	Adp.Mtx4.rotate(m, m, r.rad, r.axis);
	// // apply the rotate matrix to position
	// var new_vec = [];
	// var tmp = Adp.Vec3.create();
	// Util.convertArraySingle2Vec3(this.polygon.getVertices()).forEach(function(elem) {
	// 	Adp.Mtx4.multiplyVec3(tmp, m, elem);
 //    	new_vec.push(tmp);
	// });
	// // calculate normal
	// return Util.calculateNormal(new_vec);
}
Plane.prototype.getVBOAttributes = function getVBOAttributes()
{
	var n = this.getNormal();
	if (this.texture == null) {
		return [this.getLocalPositionVertices(),
		 		Util.increaseArrayElement(n, this.getVertexCount()),
		 		Util.increaseArrayElement(this.getColor(), this.getVertexCount())];
	}
	else {
		// v1 -> v2 -> v3 -> v4
		var t = [0, 0, 1, 0, 0, 1, 1, 1];
		return [this.getLocalPositionVertices(),
		 		Util.increaseArrayElement(n, this.getVertexCount()),
		 		Util.increaseArrayElement(this.getColor(), this.getVertexCount()),
		 		t];
	}
}
Plane.prototype.draw = function draw(gl, shader, matrices, opt)
{
	// calculate the matrix
	switch(this.getBillboardType()){
		case BILLBOARD_TYPE_XYZ:
			Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
			Adp.Mtx4.billboard(matrices.m, matrices.p, matrices.v, matrices.m, matrices.pv);
			Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
			Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
			break;
		case BILLBOARD_TYPE_Y:
			// Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
			Adp.Mtx4.billboardY(matrices.m, matrices.m, this.getPosition(), this.getNormal(), opt.camera);
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
		this.getBuffer().setTexture(gl, this.texture, 0);
		shader.setSampler(gl, 0);
	}
	this.getBuffer().setAttribute(
		gl,
		shader.getAttributeLocation(), 
		shader.getAttributeStride());
	shader.setMVPMatrix(gl, matrices.m);
	shader.setDirectionLight(gl, Global.LIGHT_DIRECTION);
	shader.setIsUseLight(gl, true);
	shader.setAmbientColor(gl, opt.selected ? Global.AMBIENT_COLOR_SELECTED : Global.AMBIENT_COLOR);
	// draw
	gl.drawElements(gl.TRIANGLES, this.getIndex().length, gl.UNSIGNED_SHORT, 0);
} 
Plane.prototype.drawForObjectPicking = function drawForObjectPicking(gl, shader, matrices)
{
	// calculate the matrix
	Adp.Mtx4.translate(matrices.m, matrices.m, this.getPosition());
	var r = this.getRotate();
	if (r != null)
		Adp.Mtx4.rotate(matrices.m, matrices.m, r.rad, r.axis);
	Adp.Mtx4.scale(matrices.m, matrices.m, this.getScale());
	Adp.Mtx4.multiply(matrices.m, matrices.pv, matrices.m);
	// passing the shader paramter
	this.getBuffer().setAttribute(
		gl,
		[shader.getAttributeLocation()[0]], 
		[shader.getAttributeStride()[0]]);
	shader.setMVPMatrix(gl, matrices.m);
	// draw
	gl.drawElements(gl.TRIANGLES, this.getIndex().length, gl.UNSIGNED_SHORT, 0);
} 

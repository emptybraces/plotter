//
// Object Base class
//
function ObjectBase(shaderId, option)
{
	// parameter initialize
	this.shaderId = shaderId;
	this.position = Adp.Vec3.create();
	this.rotate = null;
	this.scale = Adp.Vec3.create(1.0, 1.0, 1.0);
	this.index = null;
	this.color = [1.0, 1.0, 1.0, 1.0];
	this.vcount = null;
	this.localPositionVertices = null;
	this.isBufferUpdate_ = false;
	this.billboardType = null;
	if (null != shaderId){
		this.buffer = new GLBuffer();
	}
	// parameter setting
	if (!Util.isUndefined(option)){
		if (!Util.isUndefined(option.position)) 		this.position 	 = Util.clone(option.position);
		if (!Util.isUndefined(option.scale)) 			this.scale 		 = Util.clone(option.scale);
		if (!Util.isUndefined(option.rotate)) 			this.rotate 	 = Util.clone(option.rotate);
		if (!Util.isUndefined(option.color)) 			this.color 		 = Util.clone(option.color);
		if (!Util.isUndefined(option.billboardType)) 	this.billboardType= Util.clone(option.billboardType);
	}

}
//
// enable billboard
//
ObjectBase.prototype.getBillboardType = function getBillboardType(){
	return this.billboardType; 
}
//
// need update to parameters of vertex buffer object 
//
ObjectBase.prototype.isBufferUpdate = function isBufferUpdate(isUpdate){
	if (!Util.isUndefined(isUpdate))
		this.isBufferUpdate_ = isUpdate;
	return this.isBufferUpdate_; 
}
//
// object has buffer
//
ObjectBase.prototype.hasBuffer = function hasBuffer() {
	return !Util.isUndefined(this.buffer);
}
//
// get a GLbuffer object
//
ObjectBase.prototype.getBuffer = function getBuffer() {
	return this.buffer;
}
//
// create vbo
//
ObjectBase.prototype.createVBO = function createVBO(attributes) {
	if (this.hasBuffer()) {
		this.buffer.createVBO(attributes);
	}
}
//
// create ibo
//
ObjectBase.prototype.createIBO = function createIBO(indices) {
	if (this.hasBuffer()) {
		this.buffer.createIBO(indices);
	}
}
//
// update vbo
//
ObjectBase.prototype.updateVBO = function updateVBO(attributes) {
	if (this.hasBuffer()) {
		this.buffer.updateVBO(attributes);
	}
}
//
// shader id setter, getter
//
ObjectBase.prototype.getShaderId = function getShaderId(){
	return this.shaderId;
}
ObjectBase.prototype.setShaderId = function setShaderId(shaderId){
	this.shaderId = shaderId;
	return this;
}
//
// local position vertices setter, getter
ObjectBase.prototype.getLocalPositionVertices = function getLocalPositionVertices(){
	return this.localPositionVertices;
}
ObjectBase.prototype.setLocalPositionVertices = function setLocalPositionVertices(localPositionVertices){
	this.localPositionVertices = localPositionVertices;
	return this;
}
//
// position settter, getter
//
ObjectBase.prototype.getPosition = function getPosition(){
	return this.position;
}
ObjectBase.prototype.setPosition = function setPosition(position){
	if (!Util.isUndefined(position.x))
		this.position[0] = position.x;
	if (!Util.isUndefined(position.y))
		this.position[1] = position.y;
	if (!Util.isUndefined(position.z))
		this.position[2] = position.z;
	if (position.length == 3) 
		this.position = position;
	return this;
}
//
// rotate setter, getter
//
ObjectBase.prototype.getRotate = function getRotate(){
	return this.rotate;
}
ObjectBase.prototype.setRotate = function setRotate(axis, rad){
	if (axis == null) {
		this.rotate = null;
	} else {
		this.rotate = {axis: axis, rad: rad};
	}
	return this;
}
//
// scale setter, getter
//
ObjectBase.prototype.getScale = function getScale() {
	return this.scale;
}
ObjectBase.prototype.setScale = function setScale(scale){
	if (!Util.isUndefined(scale.x))
		this.scale[0] = scale.x;
	if (!Util.isUndefined(scale.y))
		this.scale[1] = scale.y;
	if (!Util.isUndefined(scale.z))
		this.scale[2] = scale.z;
	if (scale.length == 3) 
		this.scale = scale;
	return this;
}
//
// color setter, getter
//
ObjectBase.prototype.getColor = function getColor() {
	return this.color;
}
ObjectBase.prototype.setColor = function setColor(color) {
	if (!Util.isUndefined(color.r))
		this.color[0] = color.r;
	if (!Util.isUndefined(color.g))
		this.color[1] = color.g;
	if (!Util.isUndefined(color.b))
		this.color[2] = color.b;
	if (!Util.isUndefined(color.a))
		this.color[3] = color.a;
	if (color.length == 4) 
		this.color = color;
	return this;
}
//
// vertex count setter, getter
//
ObjectBase.prototype.getVertexCount = function getVertexCount()
{
	return this.vcount;
}
ObjectBase.prototype.setVertexCount = function setVertexCount(vcount)
{
	this.vcount = vcount;
	return this;
}
//
// vertex index setter, getter
//
ObjectBase.prototype.getIndex = function getIndex()
{
	return this.index;
}
ObjectBase.prototype.setIndex = function setIndex(index)
{
	this.index = index;
	return this;
}



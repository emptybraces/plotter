//
// ObjectMoveRange class
//
function ObjectMoveRange(shaderId)
{
  	// parent class
  	ObjectBase.call(this, shaderId, false);
	// Square Object
	var position = Adp.Vec3.create(0.0, 0.0, 0.0);
	this.setColor([1.0, 0.0, 0.0, 0.2]); // for debug
	var sidew = Global.GRIDLINE_LENGTH * 2;
	var sideh = Global.GRIDLINE_LENGTH * 2;
	this.square = new Square(
		shaderId,
		position, 
		this.getColor(), 
		sidew, sideh, 
		this.getScale()[0]);
	// parameter
	this.transformedLocalPositionVertices = [];
}
// inherits class
Util.inherits(ObjectMoveRange, ObjectBase);

ObjectMoveRange.prototype.getPosition = function getPosition(){
	return this.square.getPosition();
}
ObjectMoveRange.prototype.getNormal = function getNormal(){
	return this.square.getNormal();
}
ObjectMoveRange.prototype.intersectRay = function intersectRay(from, to, intersectPoint)
{
    return Intersect.polygonAndRay(
    	intersectPoint, 
    	from, 
    	to, 
    	this.transformedLocalPositionVertices, 
    	this.square.getNormal());
}
ObjectMoveRange.prototype.getIndex = function getIndex() {
	return this.square.getIndex();
}
ObjectMoveRange.prototype.getShaderId = function getShaderId() {
	return this.square.getShaderId();
}
ObjectMoveRange.prototype.getVBOAttributes = function getVBOAttributes() {
	return this.square.getVBOAttributes();
}
ObjectMoveRange.prototype.createVBO = function createVBO(gl, attributes) {
	this.square.createVBO(gl, attributes);
}
ObjectMoveRange.prototype.createIBO = function createIBO(gl, index) {
	this.square.createIBO(gl, index);
}
ObjectMoveRange.prototype.draw = function draw(gl, shader, matrices)
{
	this.square.draw(gl, shader, matrices);
} 

ObjectMoveRange.prototype.updatePosition = function updatePosition(objMgr)
{
    var selectedObjParam = objMgr.getSelected()[0];
    if (!selectedObjParam) 
    	return;
    var selectedObj = selectedObjParam.ins;

    switch(Global.OBJECT_MOVE_TYPE) {
        case 'XY': 
            this.square.setPosition([0, 0, selectedObj.getPosition()[2]]);
            this.square.setRotate(null);
            break;
        case 'XZ': 
            this.square.setPosition([0, selectedObj.getPosition()[1], 0]);
            this.square.setRotate([1, 0, 0], Math.PI/2);
            break;
        case 'YZ': 
            this.square.setPosition([selectedObj.getPosition()[0], 0, 0]);
            this.square.setRotate([0, 1, 0], Math.PI/2);
            break;
    }

    // update transformed local position vertices
	var m = Adp.Mtx4.identity();
	// transform the translate
	var t = this.square.getPosition();
	Adp.Mtx4.translate(m, m, t);
	// transform the rotate
	var r = this.square.getRotate();
	if (r != null)
		Adp.Mtx4.rotate(m, m, r.rad, r.axis);
	// apply the rotate matrix to position
	var v = [];
	$.each(Util.convertArraySingle2Vec3(this.square.getLocalPositionVertices()), function() {
		var tmp = Adp.Vec3.create();
		Adp.Mtx4.multiplyVec3(tmp, m, this);
    	v.push(tmp[0], tmp[1], tmp[2]);
	});
	this.transformedLocalPositionVertices = v;
}

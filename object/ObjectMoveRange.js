//
// ObjectMoveRange class
//
function ObjectMoveRange(shaderId)
{
	option = {};
	option.color = [1.0, 0.0, 0.0, 0.2]; // for debug
	option.sidew = Global.GRIDLINE_LENGTH * 2;
	option.sideh = Global.GRIDLINE_LENGTH * 2;
  	// parent class
  	ObjectBase.call(this, shaderId, false, option);
	// plane Object
	this.plane = new Plane(shaderId, option);
	// parameter
	this.transformedLocalPositionVertices = [];
}
// inherits class
Util.inherits(ObjectMoveRange, ObjectBase);

ObjectMoveRange.prototype.getPosition = function getPosition(){
	return this.plane.getPosition();
}
ObjectMoveRange.prototype.getNormal = function getNormal(){
	return this.plane.getNormal();
}
ObjectMoveRange.prototype.intersectRay = function intersectRay(from, to, intersectPoint)
{
    return Intersect.polygonAndRay(
    	intersectPoint, 
    	from, 
    	to, 
    	this.transformedLocalPositionVertices, 
    	this.plane.getNormal());
}
ObjectMoveRange.prototype.getIndex = function getIndex() {
	return this.plane.getIndex();
}
ObjectMoveRange.prototype.getShaderId = function getShaderId() {
	return this.plane.getShaderId();
}
ObjectMoveRange.prototype.getVBOAttributes = function getVBOAttributes() {
	return this.plane.getVBOAttributes();
}
ObjectMoveRange.prototype.createVBO = function createVBO(gl, attributes) {
	this.plane.createVBO(gl, attributes);
}
ObjectMoveRange.prototype.createIBO = function createIBO(gl, index) {
	this.plane.createIBO(gl, index);
}
ObjectMoveRange.prototype.draw = function draw(gl, shader, matrices, opt)
{
	this.plane.draw(gl, shader, matrices, opt);
} 

ObjectMoveRange.prototype.updatePosition = function updatePosition(objMgr)
{
    var selectedObjParam = objMgr.getSelected()[0];
    if (!selectedObjParam) 
    	return;
    var selectedObj = selectedObjParam.ins;

    switch(Global.OBJECT_MOVE_TYPE) {
        case 'XY': 
            this.plane.setPosition([0, 0, selectedObj.getPosition()[2]]);
            this.plane.setRotate(null);
            break;
        case 'XZ': 
            this.plane.setPosition([0, selectedObj.getPosition()[1], 0]);
            this.plane.setRotate([1, 0, 0], Math.PI/2);
            break;
        case 'YZ': 
            this.plane.setPosition([selectedObj.getPosition()[0], 0, 0]);
            this.plane.setRotate([0, 1, 0], Math.PI/2);
            break;
    }

    // update transformed local position vertices
	var m = Adp.Mtx4.identity();
	// transform the translate
	var t = this.plane.getPosition();
	Adp.Mtx4.translate(m, m, t);
	// transform the rotate
	var r = this.plane.getRotate();
	if (r != null)
		Adp.Mtx4.rotate(m, m, r.rad, r.axis);
	// apply the rotate matrix to position
	var v = [];
	$.each(Util.convertArraySingle2Vec3(this.plane.getLocalPositionVertices()), function() {
		var tmp = Adp.Vec3.create();
		Adp.Mtx4.multiplyVec3(tmp, m, this);
    	v.push(tmp[0], tmp[1], tmp[2]);
	});
	this.transformedLocalPositionVertices = v;
}

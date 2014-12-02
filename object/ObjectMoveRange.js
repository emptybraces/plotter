//
// ObjectMoveRange class
//
function ObjectMoveRange(shaderId)
{
	option = {};
	option.color = [1.0, 0.0, 0.0, 0.2]; // for debug
	option.sidew = CommonManager.DEFAULT_GRIDLINE_LENGTH * 2;
	option.sideh = CommonManager.DEFAULT_GRIDLINE_LENGTH * 2;
  	// parent class
  	ObjectBase.call(this, null, option);
	// plane Object
	this.plane = new Plane(shaderId, option);
	// parameter
	this.transformedLocalPositionVertices = null;
	this.transformedNormal = null;
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
    	this.transformedNormal);
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
// ObjectMoveRange.prototype.createVBO = function createVBO(gl, attributes) {
// 	this.plane.createVBO(attributes);
// }
// ObjectMoveRange.prototype.createIBO = function createIBO(gl, index) {
// 	this.plane.createIBO(gl, index);
// }
ObjectMoveRange.prototype.draw = function draw(shader, matrices, option)
{
	this.plane.draw(shader, matrices, option);
} 

ObjectMoveRange.prototype.updatePosition = function updatePosition()
{
    var selected = ObjectManager.getSelected();
    if (!selected) 
    	return;
    selected = selected[0]

    switch(CommonManager.OBJECT_MOVE_TYPE) {
        case 'XY': 
            this.plane.setPosition([0, 0, selected.ins.getPosition()[2]]);
            this.plane.setRotate(null);
            break;
        case 'XZ': 
            this.plane.setPosition([0, selected.ins.getPosition()[1], 0]);
            this.plane.setRotate([1, 0, 0], Math.PI/2);
            break;
        case 'YZ': 
            this.plane.setPosition([selected.ins.getPosition()[0], 0, 0]);
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
	// apply the rotate matrix to position that each vertex 
	var v = Util.convertArray2Vec3(this.plane.getLocalPositionVertices()).map(function(elem) {
		return Adp.Mtx4.multiplyVec3(m, elem);
	});
	this.transformedLocalPositionVertices = Util.flattenArray(v);
	// calculate a normal
	this.transformedNormal = Adp.Mtx4.multiplyVec3(m, this.getNormal());
}

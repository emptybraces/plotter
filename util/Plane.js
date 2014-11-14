//
// Plane constructor
//
function Plane(normal, distance)
{
	this.normal = Adp.Vec3.create();
	this.normal[0] = normal[0];
	this.normal[1] = normal[1];
	this.normal[2] = normal[2];
	this.d = distance;
}
//
// methods
//
Plane.prototype.getPosition = function getPosition(){
	return [this.normal[0] * this.d,
			this.normal[1] * this.d,
			this.normal[2] * this.d]
}
Plane.prototype.getNormal = function getNormal(){
	return this.normal;
}

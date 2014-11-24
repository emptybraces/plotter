//
// Library Adapter Class
//
var Adp = {};
var cnt = 0;
Adp.Mtx4 = {
	// create
	// identity
	// clone
	// multiply
	// translate
	// scale
	// rotate
	// lookat
	// perspective 
	// multiplyVec3
	// multiplyVec4
	create : function create(){
		return mat4.create();
	},
	identity : function identity(out) {
		if (!out)
			return mat4.identity(mat4.create());
		return mat4.identity(out);
	},
	clone : function clone(src){
		return mat4.clone(src);
	},
	multiply : function multiply(out, a, b){
		return mat4.multiply(out, a, b);
	},
	translate : function translate(out, m, v){
		return mat4.translate(out, m, v);
	},
	scale : function scale(out, m, s){
		return mat4.scale(out, m, s);
	},
	rotate : function rotate(out, m, rad, axis){
		return mat4.rotate(out, m, rad, axis);
	},
	lookAt : function lookAt(out, eye, target, up) {
		return mat4.lookAt(out, eye, target, up);
	},
	perspective : function perspective(out, fovy, aspect, near, far) {
		return mat4.perspective(out, fovy, aspect, near, far);
	},
	invert : function invert(out, src) {
		return mat4.invert(out, src)
	},
	multiplyVec3 : function multiplyVec3(out, m, v) {
		return vec3.transformMat4(out, v, m);
	},
	multiplyVec4 : function multiplyVec4(out, m, v) {
		return vec4.transformMat4(out, v, m);
	},
	transpose : function transpose(out, m) {
		return mat4.transpose(out, m);
	},
	fromRotationTranslation : function fromRotationTranslation(out, q, v){
		return mat4.fromRotationTranslation(out, q, v);
	},
	billboardY : function billboardY(out, m, position, front, camera) {
		// object to target vector
		var obj2Eye_xz = Adp.Vec3.subtract(camera.getPosition(), position);
		// xz-plane
		obj2Eye_xz[1] = 0;
		// make quaternion to the camera position vector from the front vector of objects 
		var q = Adp.Quat.identity();
		Adp.Quat.rotationTo(q, front, Adp.Vec3.normalize(obj2Eye_xz));
		// reflect the quaternion to matrix
		Adp.Mtx4.fromRotationTranslation(m, q, position);
	},
	billboard : function billboard(out, p, v, m) {
		var viewTranspose = Adp.Mtx4.identity();
		Adp.Mtx4.transpose(viewTranspose, v);
		// disable the translate 
		viewTranspose[3] = 0;
		viewTranspose[7] = 0;
		viewTranspose[11] = 0;
		viewTranspose[15] = 1;
		Adp.Mtx4.multiply(out, m, viewTranspose);
	}
};

Adp.Quat = {
	// create
	// identity
	// rotate
	// toVec3
	// clone
	// rotationTo
	create : function create() {
		return quat.create();
	},
	identity : function identity(out){
		if (arguments.length == 0) 
			return quat.identity(quat.create());
		return quat.identity(out);
	},
	rotate : function rotate(out, axis, rad){
		return quat.setAxisAngle(out, axis, rad);
	},
	toVec3 : function toVec3(out, v, q) {
		return vec3.transformQuat(out, v, q);
	},
	clone : function clone(src) {
		return quat.clone(src);
	},
	rotationTo : function rotationTo(out, a, b) {
		return quat.rotationTo(out, a, b);
	}
};

Adp.Vec2 = {
	// create
	// length
	// negate
	// dot
	// rotationTo
	create : function create(x, y) {
		var x_ = 0, y_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		return vec2.fromValues(x_, y_);
	},
	length : function length(a) {
		return vec2.length(a);
	},
	negate : function negate(out, a) {
		if (arguments.length == 1) 
			return [-out[0], -out[1]];
		return vec2.nagete(out, a);
	},
	dot : function dot(a, b) {
		return vec2.dot(a, b);
	},
	rotationTo : function rotationTo(a, b) {
		var d = this.dot(a, b);
		if (d == 0)
			return Math.PI/2;
		var na = this.length(a);
		var nb = this.length(b);
		var r = na * nb;
		if (r > 0)
			return Math.acos(d / r);
		else
			return 0;
	},
}

Adp.Vec3 = {
	// create
	// scale
	// crone
	// normalize
	// subtract
	// negate
	// dot
	// cross
	// rotateX
	// rotateY
	// rotateZ
	// rotationTo
	create : function create(x, y, z) {
		var x_ = 0, y_ = 0, z_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		if (!Util.isUndefined(z)) z_ = z;
		return vec3.fromValues(x_, y_, z_);
	},
	scale : function scale(out, a, b) {
		if (arguments.length == 3)
			return vec3.scale(out, a, b);
		out[0] * a; out[1] * a; out[2] * a;
		return out;
	},
	clone : function clone(a) {
		return vec3.clone(a);
	},
	normalize : function normalize(v) {
		return vec3.normalize(v, v);
	},
	subtract : function subtract(out, a, b) {
		if (arguments.length == 2) 
			return [out[0] - a[0], out[1] - a[1], out[2] - a[2]];
		return vec3.subtract(out, a, b);
	},
	negate : function negate(out, a) {
		if (arguments.length == 1) 
			return [-out[0], -out[1], -out[2]];
		return vec3.nagete(out, a);
	},
	dot : function dot(a, b) {
		return vec3.dot(a, b);
	},
	cross : function cross(out, a, b) {
		return vec3.cross(out, a, b);
	},
	rotateX : function rotateX(out, pt, origin, rad) {
		return vec3.rotateX(out, pt, origin, rad);
	},
	rotateY : function rotateY(out, pt, origin, rad) {
		return vec3.rotateY(out, pt, origin, rad);
	},
	rotateZ : function rotateZ(out, pt, origin, rad) {
		return vec3.rotateZ(out, pt, origin, rad);
	},
	length : function length(a) {
		return vec3.length(a);
	},
	rotationTo : function rotationTo(a, b) {
		var d = this.dot(a, b);
		if (d == 0)
			return Math.PI/2;
		var na = this.length(a);
		var nb = this.length(b);
		var r = na * nb;
		console.log(Math.acos(d / r) * Rad2Deg, a, b, d)
		if (r > 0)
			return Math.acos(d / r);
		else
			return 0;
	},
};

Adp.Vec4 = {
	// create
	create : function create(x, y, z, w) {
		var x_ = 0, y_ = 0, z_ = 0, w_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		if (!Util.isUndefined(z)) z_ = z;
		if (!Util.isUndefined(w)) w_ = w;
		return vec4.fromValues(x_, y_, z_, w_);
	},
}

Adp.Util = {

}


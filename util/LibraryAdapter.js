//
// Library Adapter Class
//
var Adp = {};

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
	}
};

Adp.Quat = {
	// create
	// identity
	// rotate
	// toVec3
	// clone
	create : function create() {
		return quat.create();
	},
	identity : function identity(out){
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
	}
};

Adp.Vec2 = {
	// create
	create : function create(x, y) {
		var x_ = 0, y_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		return vec2.fromValues(x_, y_);
	},
}

Adp.Vec3 = {
	// create
	// normalized
	// subtract
	// dot
	// cross
	// rotateX
	// rotateY
	// rotateZ
	create : function create(x, y, z) {
		var x_ = 0, y_ = 0, z_ = 0;
		if (!Util.isUndefined(x)) x_ = x;
		if (!Util.isUndefined(y)) y_ = y;
		if (!Util.isUndefined(z)) z_ = z;
		return vec3.fromValues(x_, y_, z_);
	},
	normalize : function normalize(v) {
		return vec3.normalize(v, v);
	},
	subtract : function subtract(out, a, b) {
		return vec3.subtract(out, a, b);
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


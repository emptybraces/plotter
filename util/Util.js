//
// compatible methods 
//
if(!Array.isArray) {  
	Array.isArray = function (vArg) {  
		return Object.prototype.toString.call(vArg) === "[object Array]";  
	};
}
if(!Array.copy) {
	Array.copy = function (src) {  
		return Array.prototype.concat.call(src);
	};
}


//
// Utility functions
//
var Util = {};
Util.assert = function assert(flg, msg)
{
	if (!flg) {
		console.error("assertion massage: ", msg);
		var error = new Error();
		console.log(error.stack)
		throw error;
	}
}

// Util.fixed = function fixed(number, digit) {
// 	return Number((number).toFixed(digit));
// }

Util.round = function round(number, digit)
{
	var d = Math.pow(10, digit);
	return Math.round(number*d)/d;
}
Util.restrictLength = function restrictLength(value, length)
{
	return String(value).substr(0, length);
}

Util.hasFunction = function hasFunction(func) {
	return typeof func == "function";
}

Util.changeMouseCursorIcon = function changeMouseCursorIcon(elem, mode) {
	$("#" + elem).css("cursor", mode);
}

Util.convertArrayMultiple2Single = function convertArrayMultiple2Single(src)
{
	var a = [];
	this.assert(Array.isArray(src), "src is not array type. type is " + typeof(src));
	(function(src){
		// src is not array type
		if (Object.prototype.toString.call(src).indexOf("Array") === -1) {
			a.push(src);
			return;
		}
		// src is array type
		for (var i in src) {
			arguments.callee(src[i]);
		}
	})(src);
	return a;
}

Util.increaseArrayElement = function increaseArrayElement(array, amount)
{
	var ret = [];
	for(var i = 0; i < amount; ++i) {
		for(var j in array) {
			ret.push(array[j]);
		}
	}
	return ret;
}

Util.convertArraySingle2Vec3 = function convertArraySingle2Vec3(ar)
{
	var ret = [];
	for (var i = 0; i < ar.length; i += 3) {
		ret.push(Adp.Vec3.create(ar[i], ar[i+1], ar[i+2]));
		// console.log(ar[i], ar[i+1], ar[i+2]);
	}
	return ret;
}
Util.convertArraySingle2Vec2 = function convertArraySingle2Vec2(ar)
{
	var ret = [];
	for (var i = 0; i < ar.length; i += 2) {
		ret.push(Adp.Vec2.create(ar[i], ar[i+1]));
	}
	return ret;
}

Util.screen2World = function screen2World(
	proj,
	view,
	x,
	y,
	clientWidth,
	clientHeight,
	nearClip,
	farClip)
{
	var invView = Adp.Mtx4.identity();
	var invProj = Adp.Mtx4.identity();
	var mat = Adp.Mtx4.identity();
    Adp.Mtx4.invert(invView, view);
    Adp.Mtx4.invert(invProj, proj);
    Adp.Mtx4.multiply(mat, invView, invProj);
    var out = Adp.Vec4.create();
    Adp.Mtx4.multiplyVec4(out, mat, [2.0 * (x / clientWidth) - 1.0, 2.0 * (y / clientHeight) - 1.0, nearClip, farClip])
    // this.multiplyVec4(mat, [2.0 * (x / clientWidth) - 1.0, 2.0 * (y / clientHeight) - 1.0, nearClip, farClip], out);
    return [out[0] / out[3], out[1] / out[3], out[2] / out[3]];
}


Util.cosine = function cosine(deg)
{
	if ( deg < 0 )
		return Global.TABLE.COS[ 360 - -deg % 360 ]; 
	else 
		return Global.TABLE.COS[ deg % 360 ]; 
}

Util.sine = function sine(deg)
{
	if ( deg < 0 )
		return Global.TABLE.SIN[ 360 - -deg % 360 ]; 
	else 
		return Global.TABLE.SIN[ deg % 360 ]; 
}


Util.inherits = function inherits(ctor, superCtor) {
	ctor.super_ = superCtor;
	ctor.prototype = Object.create(superCtor.prototype, {
		constructor: {
	    	value: ctor,
	    	enumerable: false,
	    	writable: true,
	    	configurable: true
    	}
	});
}

Util.clone = function clone(obj)
{
	return jQuery.extend(true, {}, obj);
}

Util.calculateNormal = function calculateNormal(vertices)
{
	switch(vertices.length) {
		case 9: case 12:
			var v = Util.convertArraySingle2Vec3(vertices);
			break;
		case 3: case 4:
			var v = vertices;
			break;
	}
	var ac = Adp.Vec3.create();
	var cb = Adp.Vec3.create();
	var cross = Adp.Vec3.create();
	Adp.Vec3.subtract(ac, v[2], v[0]);
	Adp.Vec3.subtract(cb, v[1], v[2]);
	Adp.Vec3.cross(cross, ac, cb);
	return Adp.Vec3.normalize(cross);
}

Util.isUndefined = function isUndefined(object)
{
	return typeof object === 'undefined';
}

Util.forEachMultiple = function forEachMultiple(arrays, callback, thisObject)
{
	// calculate a max list length in arrays
	var max_length = 0;
	arrays.forEach(function(elem, i) {
		this.assert(Array.isArray(elem),
					"element in first argument is not array object. element index is:" + i);
		max_length = Math.max(max_length, elem.length);
	}, this);

	// do callback 
	for (var i = 0; i < max_length; ++i){
		var args = [];
		arrays.forEach(function(elem){
			args.push(elem.length <= i ? null : elem[i]);
		});
		callback.apply(this.isUndefined(thisObject) ? null : thisObject, args);
	}
}
Util.defineProperty = function defineProperty(obj, prop, value)
{
	// recycling same object
	function withValue(value) {
		var d = withValue.d || (
			withValue.d = {
				enumerable: false,
				writable: false,
				configurable: false,
				value: null
			}
		);
		d.value = value;
		return d;
	}
	Object.defineProperty(obj, prop, withValue(value));
}
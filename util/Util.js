//
// compatible methods 
//
if(!Array.isArray) {  
	Array.isArray = function (vArg) {  
		return Object.prototype.toString.call(vArg) === "[object Array]";  
	};
}
if(!Array.isTypedArray) {  
	Array.isTypedArray = function (vArg) {  
		return Object.prototype.toString.call(vArg.buffer) === "[object ArrayBuffer]";  
	};
}
if(!Array.copy) {
	Array.copy = function (src) {  
		return Array.prototype.concat.call(src);
	};
}
if(!String.prototype.contains){
	console.log("nakattayo")
	String.prototype.contains = function(it) { 
		return this.indexOf(it) != -1;
	};
}

if(!window.console) 			window.console = {};
if(!window.console.log)			window.console.log = function(){};
if(!window.console.debug) 		window.console.debug = function(){};
if(!window.console.info)		window.console.info = function(){};
if(!window.console.warn)		window.console.warn = function(){};
if(!window.console.error)		window.console.error = function(){};
if(!window.console.dir)			window.console.dir = function(){};
if(!window.console.trace)		window.console.trace = function(){};
if(!window.console.assert)		window.console.assert = function(){};
if(!window.console.dirxml)		window.console.dirxml = function(){};
if(!window.console.group)		window.console.group = function(){};
if(!window.console.groupEnd)	window.console.groupEnd = function(){};
if(!window.console.time)		window.console.time = function(){};
if(!window.console.timeEnd)		window.console.timeEnd = function(){};
if(!window.console.profile)		window.console.profile = function(){};
if(!window.console.profileEnd)	window.console.profileEnd = function(){};
if(!window.console.count)		window.console.count = function(){};
if(!window.console.table)		window.console.table = function(){};

//
// Utility functions
//
var Util = (function(){

	/// private parameter
	var enable_info_ 	= true;
	var enable_warn_ 	= true;
	var enable_error_	= true;
	var enable_assertlog_= true;
	var enable_assert_	= true;
	var rad2deg_		= 57.29577951;
	var deg2rad_		= 0.017453293;
	var cosine_table_ 	= (function(){
		var c = new Array(360);
		for (var i = 0; i < 360; ++i)
			c[i] = Math.cos(deg2rad_ * i);
		return c;
	})();
	var sine_table_ 	= (function(){
		var c = new Array(360);
		for (var i = 0; i < 360; ++i)
			c[i] = Math.sin(deg2rad_ * i);
		return c;
	})();

	function callerPoint(actualCallerPoint) {
		if (actualCallerPoint == null) 
			actualCallerPoint = 0;
		var caller = new Error().stack.split("\n")[actualCallerPoint].split("\/");
	    var caller_with_line = caller[caller.length-1].match(/^.*:\d+(?=:)/)
	    return " <" + caller_with_line + ">";
	}
	function dispatchConsoleFunctions(callback, actualCallerPoint) {
		function log(){
			var args_array = Array.prototype.slice.call(arguments);
			callback.apply(null, args_array.concat(callerPoint(actualCallerPoint)));
		}
		return log;
	}

	/// objects
	return {
		// logs
		info 		: !enable_info_ ? function(){} : dispatchConsoleFunctions(console.info.bind(console), 3),
		warn 		: !enable_warn_ ? function(){} : dispatchConsoleFunctions(console.warn.bind(console), 3),
		error 		: !enable_error_ ? function(){} : dispatchConsoleFunctions(console.error.bind(console), 3),
		error1 		: !enable_error_ ? function(){} : dispatchConsoleFunctions(console.error.bind(console), 4),
		assertlog 	: !enable_assertlog_ ? function(){} : dispatchConsoleFunctions(console.assert.bind(console), 3),
		// assertion
		assert : !enable_assert_ ? function(){} : 
			function assert(expr, msg) {
				if(!(expr)) {
					this.error1("assertion massage: " + msg);
					throw new Error()
				}
			},
		// round to specified number of decimal point
		round : function round(number, digit) {
			var d = Math.pow(10, digit);
			return Math.round(number*d)/d;
		},
		// restrivt value length
		restrictLength : function restrictLength(value, length) {
			return String(value).substr(0, length);
		},
		// check whether defined as a function
		hasFunction : function hasFunction(func) {
			return typeof func == "function";
		},
		// check whether a undefined variable
		isUndefined : function isUndefined(object)
		{
			return object === undefined;
		},
		// expands the built-in Array#forEach method
		forEachMultiple : function forEachMultiple(arrays, callback, thisObject)
		{
			// calculate a max length in arrays and check whether a array instance.
			var max_length = 0;
			arrays.forEach(function(elem, i) {
				this.assert(Array.isArray(elem),
							"element in first argument is not array object. element index is:" + i);
				max_length = Math.max(max_length, elem.length);
			}, this);

			// do callback 
			thisObject = this.isUndefined(thisObject) ? null : thisObject;
			for (var i = 0; i < max_length; ++i){
				var args = [];
				arrays.forEach(function(elem){
					args.push(elem.length <= i ? null : elem[i]);
				});
				callback.apply(thisObject, args);
			}
		},
		// generic deep copy 
		clone : function clone(obj) {
		    var copy;
		    // Handle the 3 simple types, and null or undefined
		    if (null == obj || "object" != typeof obj)
		    	return obj;
		    // Handle Array
		    if (Array.isArray(obj)) {
		        copy = [];
		        for (var i = 0, len = obj.length; i < len; i++) {
		            copy[i] = clone(obj[i]);
		        }
		        return copy;
		    }
		    // Handle Object
		    else if (obj instanceof Object) {
		    	// typed array
		    	if (Array.isTypedArray(obj)) {
		    		return obj.subarray();
		    	}
		    	// standard  
		        copy = {};
		        for (var attr in obj) {
		            if (obj.hasOwnProperty(attr)) 
		            	copy[attr] = clone(obj[attr]);
		        }
		        return copy;
		    }
		    // Handle Date
		    else if (obj instanceof Date) {
		        copy = new Date();
		        copy.setTime(obj.getTime());
		        return copy;
		    }
		    throw new Error("Unable to copy obj! Its type isn't supported.");
		},
		// ingerits a class
		inherits : function inherits(ctor, superCtor)
		{
			ctor.super_ = superCtor;
			ctor.prototype = Object.create(superCtor.prototype, {
				constructor: {
			    	value: ctor,
			    	enumerable: false,
			    	writable: true,
			    	configurable: true
		    	}
			});
		},
		// define a new property
		defineProperty : function defineProperty(obj, prop, value)
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
		},
		// flatten a multidimentional array
		flattenArray : function flattenArray(src)
		{
			var a = [];
			this.assert(Array.isArray(src), "argument is not array type. type is " + typeof(src));
			(function(src){
				// src is not array type
				if (!Array.isArray(src) && !Array.isTypedArray(src)) {
					a.push(src);
					return;
				}
				// src is array type
				for (var i in src) {
					arguments.callee(src[i]);
				}
			})(src);
			return a;
		},
		// convert a array to vector3
		convertArray2Vec3 : function convertArray2Vec3(array)
		{
			var result = [];
			for (var i = 0, l = array.length; i < l; i += 3) {
				result.push(Adp.Vec3.create(array[i], array[i+1], array[i+2]));
			}
			return result;
		},
		// convert a array to vector2
		convertArray2Vec2 : function convertArray2Vec2(array)
		{
			var result = [];
			for (var i = 0, l = array.length; i < l; i += 2) {
				result.push(Adp.Vec2.create(array[i], array[i+1]));
			}
			return result;
		},		
		// increase an element
		increaseElement : function increaseElement(object, amount)
		{
			var result = [];
			// array type
			if (Array.isArray(object)) {
				for(var i = 0; i < amount; ++i) {
					result = result.concat(object);
				}
			// typed array type
			} else if(Array.isTypedArray(object)) {
				for(var i = 0; i < amount; ++i) {
					Array.prototype.forEach.call(object, function(e){
						result.push(e);
					});
				}
			// other than those
			} else if(object != null){
				for(var i = 0; i < amount; ++i) {
					result.push(object);
				}
			// null or undefind
			} else {
				Util.error("invalid argument. arg is " + object)
			}
			return result;
		},
		// convert a screen coordinates to world
		screen2World : function screen2World(
			proj,
			view,
			scrx,
			scry,
			clientWidth,
			clientHeight,
			nearClip,
			farClip)
		{
			var inv_view = Adp.Mtx4.identity();
			var inv_proj = Adp.Mtx4.identity();
			var mat = Adp.Mtx4.identity();
		    Adp.Mtx4.invert(inv_view, view);
		    Adp.Mtx4.invert(inv_proj, proj);
		    Adp.Mtx4.multiply(mat, inv_view, inv_proj);
		    var out = Adp.Vec4.create();
		    Adp.Mtx4.multiplyVec4(out, mat, [2.0 * (scrx / clientWidth) - 1.0, 2.0 * ((clientHeight-scry) / clientHeight) - 1.0, nearClip, farClip])
		    return [out[0] / out[3], out[1] / out[3], out[2] / out[3]];
		},
		// gets a radian value from precalculated cosine table
		cosine : function cosine(deg)
		{
			if ( deg < 0 )
				return cosine_table_[ 360 - -deg % 360 ]; 
			else 
				return cosine_table_[ deg % 360 ]; 
		},
		// gets a radian value from precalculated sine table
		sine : function sine(deg)
		{
			if ( deg < 0 )
				return sine_table_[ 360 - -deg % 360 ]; 
			else 
				return sine_table_[ deg % 360 ]; 
		},
		// calculate a triangle plane's normals
		calculateNormal : function calculateNormal(vertices)
		{
			switch(vertices.length) {
				case 9: case 12:
					var v = this.convertArray2Vec3(vertices);
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
		},
		// change the mouse cursor icon
		changeMouseCursorIcon : function changeMouseCursorIcon(elem, mode) {
			$("#" + elem).css("cursor", mode);
		},
		// calculate a normal lerp
		lerp : function lerp(begin, period, d){
			return begin + d * (period - begin);
		},


		/// constants
		RAD2DEG : rad2deg_,
		DEG2RAD : deg2rad_,
	};
})();

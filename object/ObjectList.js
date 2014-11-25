//
// ObjectList class
//
var ObjectList = function(gl) {
	// normal object
	var objects = [];
	var deferred_objects = [];
	var current_object_id = 0;
	var is_drawable_object_picking = false;
	var object_picking_buffer = null;
	// camera object
	var camera_objects = [];
	var current_camera = null;

	// object structure
	var Object_ = function(instance, option) {
		return {
			ins: instance,
			opt: option
		};
	}
	// option structure
	var Option_ = function(){
		return {
			id: null,
			name: "",
			selected: false,
			drawable: false,
			updateable: false
		};
	}
	// empty object
	var empty_option = new Option_();
	empty_option.id = -1;
	empty_option.name = "empty";
	var empty_object = Object_(new EmptyObject(), empty_option);

	//
	// generate object identifier
	//
	function GenerateId()
	{
		return current_object_id++;
	}
	//
	// get a object using the id in list
	//
	function GetId(id)
	{
		if (id[1] != 255 || id[2] != 255 || id[3] != 255)
			return null;

		var obj = null;
		jQuery.each(objects, function() {
			if (this.opt.id == id[0]) {
				obj = this;
				return false; // loop break
			}
		});
		return obj;
	}
	//
	// convert object identifier to color
	//
	function GenerateColor(id)
	{
		return [id % 255 / 255, 1.0, 1.0, 1.0];
	}

	return {
		initialize: function initialize()
		{
		    // create frame buffer that for Object Picking
		    object_picking_buffer = (function(){
		    	var object_picking_buffer = gl.createFramebuffer();
			    gl.bindFramebuffer(gl.FRAMEBUFFER, object_picking_buffer);

			    // create renderbuffer
			    var depthBuffer = gl.createRenderbuffer();
			    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
			    
			    // allocate renderbuffer
			    gl.renderbufferStorage(
			          gl.RENDERBUFFER,
			          gl.DEPTH_COMPONENT16,
			          gl.canvas.width,
			          gl.canvas.height);  

			    gl.framebufferRenderbuffer(
			          gl.FRAMEBUFFER,
			          gl.DEPTH_ATTACHMENT,
			          gl.RENDERBUFFER,
			          depthBuffer);
			    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
			       console.error("this combination of attachments does not work");
			       return -1;
			    }
			    // attach renderebuffer
			    // フレームバッファ用テクスチャの生成
			    var t = gl.createTexture();
			    gl.bindTexture(gl.TEXTURE_2D, t);
			    // フレームバッファ用のテクスチャをバインド
			    // フレームバッファ用のテクスチャにカラー用のメモリ領域を確保
			    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			    // テクスチャパラメータ
			    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0)

			    // 各種オブジェクトのバインドを解除
			    gl.bindTexture(gl.TEXTURE_2D, null);
			    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			    return object_picking_buffer;
			})();

		    return 0;
		},
		//
		// add object
		//
		add: function add(obj, option)
		{
			var target_list = null;
			// camera object
			if (obj instanceof Camera) {
				target_list = camera_objects;
				if (current_camera == null) {
					current_camera = obj;
				}
			}
			else {
				target_list = objects;
			}

			// already registered
			if (target_list.some(function(elem){
					return elem == obj;
				})) {
				console.error("already registered");
			}
			// fill to option
			if(Util.isUndefined(option)) option = {};
			if(Util.isUndefined(option.name)) option.name = "unnamed";
			option.drawable 	= option.drawable === false ? false : Util.hasFunction(obj.draw);
			option.updateable 	= option.updateable === false ? false : Util.hasFunction(obj.update);
			option.selected 	= false;
			option.id 			= GenerateId();
			
			// Model instance case
			if (Util.hasFunction(obj.isLoadCompleted) && !obj.isLoadCompleted()){
				deferred_objects.push(new Object_(obj, option));
				return;
			}

			// add to list
			target_list.push(new Object_(obj, option));
			// create buffer object
			obj.createVBO(gl, obj.getVBOAttributes());
			obj.createIBO(gl, obj.getIndex());
			obj.isBufferUpdate(false);
		},
		//
		// delete object
		//
		remove: function remove(obj)
		{
			objects.forEach(function(e, i, a){
				if (e.opt.id == obj.opt.id) {
					a[i] = empty_object;
				}
			});
		},
		//
		// sort object
		//
		sort: function sort()
		{
			var cp = current_camera.getPosition();
			objects.sort(function(a, b) {
				var ap = a.ins.getPosition();
				var bp = a.ins.getPosition();
				var ax = ap[0] - cp[0];
				var ay = ap[1] - cp[1];
				var az = ap[2] - cp[2];
				var bx = bp[0] - cp[0];
				var by = bp[1] - cp[1];
				var bz = bp[2] - cp[2];
				var ad = ax*ax + ay*ay * az*az;
				var bd = bx*bx + by*by * bz*bz;
				return ad > bd ? 1 : -1;
			});

			var new_objects = [];
			var alpha_objects = [];
			objects.forEach(function(elem){
				var alpha = elem.ins.getColor()[3];
				if(alpha != 1.0) {
					alpha_objects.push(elem);
				} else {
					new_objects.push(elem);
				}
			});
			objects = new_objects.concat(alpha_objects);
		},
		//
		// update all object you have
		//
		update: function update()
		{
			objects.forEach(function(obj) {
				var ins = obj.ins;
				var opt = obj.opt;
				// need update vertex buffer
				if (ins.isBufferUpdate())
				{
					ins.updateVBO(gl, ins.getVBOAttributes());
					ins.isBufferUpdate(false);
				}

				// update process for each object
				if (opt.updateable){
				}
			}, this);

			// add deferred object to main object list
			if (0 < deferred_objects.length) {

				// load completed object
				var loadCompletedObjects = deferred_objects.filter(function(obj){
					return obj.ins.isLoadCompleted();
				});

				loadCompletedObjects.forEach(function(obj){
					obj.ins.callbackCompleted();
					this.add(obj.ins, obj.opt);
				}, this);

				// remove deferred objects
				deferred_objects = deferred_objects.filter(function(obj){
					return !loadCompletedObjects.some(function(completedObj){
						return completedObj.opt.id == obj.opt.id;
					});
				});
				// deferred_objects.forEach(function(obj){
				// 	console.log("deferred:", obj.opt.id)
				// }, this);
			}
		},
		//
		// draw all object you have
		//
		draw: function draw(shader)
		{
		    var cc = Global.PRIMARY_BUFFER_CLEAR_COLOR;
		    var clear_depth = Global.PRIMARY_BUFFER_DEPTH_VALUE;
			var pMatrix = Adp.Mtx4.identity();
			var vMatrix = Adp.Mtx4.identity();
			var mMatrix = Adp.Mtx4.identity();
			var pvMatrix = Adp.Mtx4.identity();
			var inverseMatrix = Adp.Mtx4.identity();
			current_camera.perspective(pMatrix);
			current_camera.lookAt(vMatrix);
			Adp.Mtx4.multiply(pvMatrix, pMatrix, vMatrix);

			// switch primary rendering
		    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		    // clear color
		    gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
		    gl.clearDepth(clear_depth);
		    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		    // draw
			objects.forEach(function(elem) {
				if (!elem.opt.drawable)
					return ; // continue loop
				var ins = elem.ins;
				var opt = elem.opt;

				var obj_shader = null;
				if (ins.getShaderId() != null) {
					obj_shader = shader.switchShader(ins.getShaderId());
				} 

				Adp.Mtx4.identity(mMatrix);
				Adp.Mtx4.identity(inverseMatrix);
				var matrices = {
					m: mMatrix,
					v: vMatrix,
					p: pMatrix,
					pv: pvMatrix,
					inv: inverseMatrix
				}
				opt.shaderObject = shader;
				opt.camera = current_camera;
				ins.draw(gl, obj_shader, matrices, opt);
			});
			gl.flush();
		},
		//
		// switch drawable for object picking 
		//
		objectPicking: function objectPicking(shader, screenx, screeny)
		{
		    var cc = Global.PRIMARY_BUFFER_CLEAR_COLOR;
		    var clear_depth = Global.PRIMARY_BUFFER_DEPTH_VALUE;
			var pMatrix = Adp.Mtx4.identity();
			var vMatrix = Adp.Mtx4.identity();
			var mMatrix = Adp.Mtx4.identity();
			var pvMatrix = Adp.Mtx4.identity();
			current_camera.perspective(pMatrix);
			current_camera.lookAt(vMatrix);
			Adp.Mtx4.multiply(pvMatrix, pMatrix, vMatrix);

			// switch object picking rendering
			gl.bindFramebuffer(gl.FRAMEBUFFER, object_picking_buffer);
		    // clear color
		    gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
		    gl.clearDepth(clear_depth);
		    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			objects.forEach(function(elem) {
				if (!Util.hasFunction(elem.ins.drawForObjectPicking) 
					|| !elem.opt.drawable)
					return; // continue loop
				var ins = elem.ins;
				var opt = elem.opt;
				opt.camera = current_camera;
				var obj_shader = shader.switchShader(
					(ins.getShaderId() != "shader_point" ? "shader_boundary" : "shader_point"));

				Adp.Mtx4.identity(mMatrix);
				var matrices = {
					m: mMatrix,
					v: vMatrix,
					p: pMatrix,
					pv: pvMatrix
				}
				obj_shader.setObjectColor(gl, GenerateColor(opt.id));
				ins.drawForObjectPicking(gl, obj_shader, matrices, opt);
			}, this);

			// get the screen pixel color
			var c = new Uint8Array(4);
			gl.readPixels(screenx, screeny, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, c);
			// get a object using the color obtained
			return GetId(c);
		},
		//
		// print the selected object parameter
		//
		printObjectParameter: function printObjectParameter()
		{
			var param = this.getSelected()[0];
			if (!param)
				return;
			var pos = param.ins.getPosition();
			var x = Number(pos[0]).toFixed(4);
			var y = Number(pos[1]).toFixed(4);
			var z = Number(pos[2]).toFixed(4);
			var color = param.ins.getColor();
			var r = Math.round(color[0] * 255);
			var g = Math.round(color[1] * 255);
			var b = Math.round(color[2] * 255);
			var a = Number(color[3]).toFixed(1);
			var scale = param.ins.getScale();
			var sx = Number(scale[0]).toFixed(3);
			var sy = Number(scale[1]).toFixed(3);
			var sz = Number(scale[2]).toFixed(3);
			$("#object_position_x_value").text(x);
			$("#object_position_x_tb").val(x);
			$("#object_position_y_value").text(y);
			$("#object_position_y_tb").val(y);
			$("#object_position_z_value").text(z);
			$("#object_position_z_tb").val(z);
			$("#object_color_r_value").text(r);
			$("#object_color_r_tb").val(r);
			$("#object_color_g_value").text(g);
			$("#object_color_g_tb").val(g);
			$("#object_color_b_value").text(b);
			$("#object_color_b_tb").val(b);
			$("#object_color_a_value").text(a);
			$("#object_color_a_tb").val(a);
			$("#object_scale_x_value").text(sx);
			$("#object_scale_x_tb").val(sx);
			$("#object_scale_y_value").text(sy);
			$("#object_scale_y_tb").val(sy);
			$("#object_scale_z_value").text(sz);
			$("#object_scale_z_tb").val(sz);
		},
		//
		// unselect to selected object
		//
		unselect: function unselect()
		{
			objects.forEach(function(elem) {
				elem.opt.selected = false;
			});
		},
		//
		// selecting object
		//
		select: function select(objParam)
		{
			objParam.opt.selected = true;
		},
		//
		// is selected
		//
		isSelected: function isSelected()
		{
			return objects.some(function(elem){
				return elem.opt.selected;
			});
		},
		//
		// get a selected object
		//
		getSelected: function getSelected()
		{
			return objects.filter(function(elem){
				return elem.opt.selected;
			});
		},
		//
		// get a object using the name
		//
		getName: function getName(name)
		{
			return objects.filter(function(elem){
				return elem.opt.name == name;
			});
		},
		//
		// get a object using the id
		//
		getId: function getId(id)
		{
			return objects.filter(function(elem){
				return elem.opt.id == name;
			})[0];
		},
		//
		// specify the current camera
		//
		setCurrentCamera : function setCurrentCamera() {
			current_camera = object;
			return this;
		},
		//
		// get the current camera
		//
		getCurrentCamera : function getCurrentCamera(object) {
			return current_camera;
		},
		//
		// dump objects paramter
		//
		dump : function dump() {
			objects.forEach(function(elem){
				console.log(elem.opt.id, elem.opt.name, elem.ins.getColor());
			})
		},
	};
}

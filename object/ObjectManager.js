//
// ObjectManager class
//
var ObjectManager = (function(){
	/// private properties
	var objects_ = [];
	var deferred_objects_ = [];
	var framebuffer_object_picking_ = null;
	var text_context_ = null;
	var text_canvas_ = null;
	/// private methods
	// convert object identifier to color
	function generateColorById(id){
		// limit of object identifier is 0xFFFFFF
		var r = (id & 0xFF) / 255;
		var g = (id & 0xFF00) / 255;
		var b = (id & 0xFF0000) / 255;
		var a = 1.0; // not use
		return [r, g, b, a];
	}
	function generateIdByColor(color){
		var r = color[0], g = color[1], b = color[2];
		return (b << 16) || (g << 8) || r;

	}

	// object
	return {
		// getter / setter
		getTextContext : function getTextContext() {return text_context_;},
		getTextCanvas : function getTextCanvas() {return text_canvas_;},
		// initalizing
		initialize: function initialize()
		{
		    // create frame buffer for Object Picking
		    framebuffer_object_picking_ = Adp.GL.createFrameBufferWithDepth();
		    // create the canvas for text texture 
		    $("#canvas_area").append("<canvas id='textureCanvas' style='border: none' width='512' height='512'>");
    	    text_canvas_ = document.getElementById('textureCanvas')
		    text_context_ = text_canvas_.getContext('2d');
		    // text_context_.fillStyle = "white";
		    text_context_.font = "30px 'ＭＳ ゴシック'";
		    text_context_.textAlign = "left";
		    text_context_.textBaseline = "top";
		    text_context_.save();
		},
		// add object
		add: function add(instance, option)
		{
			// already registered
			if (objects_.some(function(elem){
					return elem == instance;
				})) {
				console.error("already registered, so aborted.");
				return;
			}
			
			// for instance with loading process
			if (Util.hasFunction(instance.isLoadCompleted) && !instance.isLoadCompleted()){
				deferred_objects_.push(CommonManager.unitObject(instance, option));
				return;
			}

			// adds to list
			objects_.push(CommonManager.unitObject(instance, option));
		},
		// delete object
		remove: function remove(obj)
		{
			objects_.forEach(function(e, i, a){
				if (e.opt.id == obj.opt.id) {
					a[i] = CommonManager.emptyObject();
				}
			});
		},
		// sort object
		sort: function sort()
		{
			var cp = CameraManager.position();
			objects_.sort(function(a, b) {
				var ap = a.ins.getPosition();
				var bp = b.ins.getPosition();
				var ax = ap[0] - cp[0];
				var ay = ap[1] - cp[1];
				var az = ap[2] - cp[2];
				var bx = bp[0] - cp[0];
				var by = bp[1] - cp[1];
				var bz = bp[2] - cp[2];
				var ad = ax*ax + ay*ay + az*az;
				var bd = bx*bx + by*by + bz*bz;
				return ad > bd ? 1 : -1;
			});

			var new_objects = [], alpha_objects = [];
			objects_.forEach(function(elem){
				var alpha = elem.ins.getColor()[3];
				if(alpha != 1.0) {
					alpha_objects.push(elem);
				} else {
					new_objects.push(elem);
				}
			});
			objects_ = new_objects.concat(alpha_objects);
		},
		// update all object you have
		update: function update()
		{
			objects_.forEach(function(obj) {
				var ins = obj.ins;
				var opt = obj.opt;
				// need update vertex buffer
				if (ins.isBufferUpdate()){
					ins.updateVBO(ins.getVBOAttributes());
					ins.isBufferUpdate(false);
				}

				// update process for each object
				if (opt.updateable){
				}
			});

			// add deferred object to valid list
			if (0 < deferred_objects_.length) {

				// load completed object
				var load_completed_objects = deferred_objects_.filter(function(obj){
					return obj.ins.isLoadCompleted();
				});
				// add load completed object to valid list
				load_completed_objects.forEach(function(obj){
					obj.ins.callbackCompleted();
					this.add(obj.ins, obj.opt);
				}, this);
				// remove deferred objects
				deferred_objects_ = deferred_objects_.filter(function(obj){
					return !load_completed_objects.some(function(completedObj){
						return completedObj.opt.id == obj.opt.id;
					});
				});
			}
		},
		// draw all object you have
		draw : function draw()
		{
			// test
			// this.objectPicking(0, 0);
			// return ;
			var p_matrix = CameraManager.perspective();
			var v_matrix = CameraManager.view();
			var pv_matrix = CameraManager.pvMatrix();

			// switch the primary frame buffer
		    Adp.GL.bindFramebuffer(null);
		    // clear the frame buffer
		    Adp.GL.clear(CommonManager.PRIMARY_BUFFER_CLEAR_COLOR, 1.0);

		    // draw
			objects_.forEach(function(elem) {
				var ins = elem.ins;
				var opt = elem.opt;
				// skip the draw phase
				if (!opt.drawable)
					return ; // continue loop

				// switch the shader bound to object and get it
				var obj_shader = null;
				if (ins.getShaderId() != null) {
					obj_shader = ShaderManager.switchShader(ins.getShaderId());
				} 
				// gather matrices and intializing
				var matrices = {
					m: Adp.Mtx4.identity(),
					v: v_matrix,
					p: p_matrix,
					pv: pv_matrix,
					inv: Adp.Mtx4.identity(),
				};

				// draw process
				ins.draw(obj_shader, matrices, opt);
			});
			Adp.GL.flush();
		},
		// draw to frame buffer for object picking 
		objectPicking: function objectPicking(screenx, screeny)
		{
			var p_matrix = CameraManager.perspective();
			var v_matrix = CameraManager.view();
			var pv_matrix = CameraManager.pvMatrix();

			// switch the frame buffer for object picking 
		    Adp.GL.bindFramebuffer(framebuffer_object_picking_);
		    // Adp.GL.bindFramebuffer(null);
		    // clear the frame buffer
		    Adp.GL.clear([0.0, 0.0, 0.0, 1.0], 1.0);
		    // draw
			objects_.forEach(function(elem) {
				var ins = elem.ins;
				var opt = elem.opt;
				// skip the object that cannot picking
				if (!Util.hasFunction(elem.ins.drawForObjectPicking) 
					|| !elem.opt.drawable)
					return; // continue loop
				// switch the shader
				var obj_shader = ShaderManager.switchShader(
					(ins.getShaderId() != "shader_point" ? "shader_boundary" : "shader_point"));
				// gather matrices and intializing
				var matrices = {
					m: Adp.Mtx4.identity(),
					v: v_matrix,
					p: p_matrix,
					pv: pv_matrix
				}
				obj_shader.setObjectColor(generateColorById(opt.id));
				ins.drawForObjectPicking(obj_shader, matrices, opt);
			}, this);
			// Adp.GL.flush();
			var color = Adp.GL.readPixel(screenx, screeny);
			// get the object by using the pixel color
			var id = generateIdByColor(color);
			return this.getObjectById(id);
		},
		// print the selected object parameter
		printObjectParameter: function printObjectParameter()
		{
			var objects = this.getSelected();
			if (!objects)
				return;
			var obj = objects[0];
			var pos = obj.ins.getPosition();
			var x = Number(pos[0]).toFixed(4);
			var y = Number(pos[1]).toFixed(4);
			var z = Number(pos[2]).toFixed(4);
			var color = obj.ins.getColor();
			var r = Math.round(color[0] * 255);
			var g = Math.round(color[1] * 255);
			var b = Math.round(color[2] * 255);
			var a = Number(color[3]).toFixed(1);
			var scale = obj.ins.getScale();
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
		// unselect to selected object
		unselect: function unselect()
		{
			objects_.forEach(function(elem) {
				elem.opt.selected = false;
			});
		},
		// selecting object
		select: function select(object)
		{
			object.opt.selected = true;
		},
		// is selected
		isSelected: function isSelected()
		{
			return objects_.some(function(elem){
				return elem.opt.selected;
			});
		},
		// get a selected object
		getSelected: function getSelected()
		{
			var result = objects_.filter(function(elem){
				return elem.opt.selected;
			});
			return result.length == 0 ? null : result;
		},
		// get a object by using the name
		getObjectByName: function getObjectByName(name)
		{
			var result = objects_.filter(function(elem){
				return elem.opt.name == name;
			});
			return result.length == 0 ? null : result;
		},
		// get a object by using the id
		getObjectById: function getObjectById(id)
		{
			var result = objects_.filter(function(elem){
				return elem.opt.id == id;
			});
			return result.length == 0 ? null : result[0];
		},
		// dump objects_ paramter
		dump : function dump() {
			objects_.forEach(function(elem){
				console.log(elem.opt.id, elem.opt.name, elem.ins.getColor());
			})
		},

		/// constants
	}
})();


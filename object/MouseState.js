//
//
//
function MouseState(target_element) {
	this.click_coord = [];
	this.release_coord = [];
	this.offset_coord = [];
	this.move_coord = [];
	this.backup_coord = [];
	this.is_click = false;
	this.is_press = false;
	this.is_move = false;
	this.is_release = false;
	this.is_press_prev = false;
	this.click_kind = null;

	this.wheel_delta = 0;
	var _this = this;

	target_element.on({
		mousedown: function(e) {
			if (_this.click_kind)
				return;
			_this.is_click = true;
			_this.click_coord[0] = e.pageX - $(this).offset().left;
			_this.click_coord[1] = Global.CLIENT_HEIGHT - (e.pageY - $(this).offset().top);
			_this.click_kind = e.which;
		},
		mouseup: function(e) {
			if (_this.click_kind != e.which)
				return;
			_this.is_release = true;
			_this.release_coord[0] = e.pageX - $(this).offset().left;
			_this.release_coord[1] = Global.CLIENT_HEIGHT - (e.pageY - $(this).offset().top);
			_this.click_kind = null;
		},
		mousemove: function(e) {
			if (_this.isHold()) {
				_this.offset_coord[0] = (e.pageX - $(this).offset().left) - _this.click_coord[0];
				_this.offset_coord[1] = Global.CLIENT_HEIGHT - (e.pageY - $(this).offset().top) - _this.click_coord[1];
			}
		},
		mouseleave: function(e) {
			_this.is_release = true;
			_this.backup_coord[0] = _this.backup_coord[1] = 0;
			_this.click_kind = null;
		}

	});

	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	target_element.on(mousewheelevent,function(e){
		var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
		_this.wheel_delta += delta < 0 ? Global.MOUSE_WHEEL_POWER : -Global.MOUSE_WHEEL_POWER;
	});

}

MouseState.prototype.update = function() {

	// mouse wheel control
	if (this.isWheel()) {
		this.wheel_delta *= Global.MOUSE_WHEEL_DEC_RATE;
		// console.log(this.wheel_delta);
	}

	// mouse button control
	if ( this.is_release ) {
		this.is_click = false;
		this.is_release = false;
		this.is_press = false;
		this.is_move = false;
		return;
	} else if( this.is_click ) {
		this.is_click = this.is_release = false;
		this.is_press = true;
		this.backup_coord[0] = this.backup_coord[1] = 0;
		this.offset_coord[0] = this.offset_coord[1] = 0;
		return;
	} else if (this.isHold()) {
		// マウスが動いているかどうか検出する
		if (this.backup_coord[0] != this.offset_coord[0] 
			|| this.backup_coord[1] != this.offset_coord[1]) {
			this.is_move = true;
			this.move_coord[0] = this.offset_coord[0] - this.backup_coord[0];
			this.move_coord[1] = this.offset_coord[1] - this.backup_coord[1];
			this.backup_coord[0] = this.offset_coord[0];
			this.backup_coord[1] = this.offset_coord[1];
			return;
		}
	}
	this.is_move = false;
	this.is_press_prev = this.is_press;
}
/// クリック座標を取得する
MouseState.prototype.getClickCoord = function getClickCoord() {
	return this.click_coord;
}
/// クリック座標-現在座標を取得する
MouseState.prototype.getOffsetCoord = function getOffsetCoord() {
	return this.offset_coord;
}
/// 移動量を取得する
MouseState.prototype.getMoveCoord = function getMoveCoord() {
	return this.move_coord;
}
/// 直前フレームのオフセット座標を取得する
MouseState.prototype.getBackupCoord = function getBackupCoord() {
	return this.backup_coord;
}
/// リリース座標を取得する
MouseState.prototype.getReleaseCoord = function getReleaseCoord() {
	return this.release_coord;
}
MouseState.prototype.getClickKind = function getClickKind() {
	return this.click_kind;
}
MouseState.prototype.isClick = function() {
	return !this.is_press_prev && this.is_press;
}
MouseState.prototype.isHold = function() {
	return this.is_press_prev && this.is_press;
}
MouseState.prototype.isRelease = function() {
	return this.is_press_prev && !this.is_press;
}
MouseState.prototype.isLeave = function() {
	return this.isRelease();
}
MouseState.prototype.isMove = function() {
	return this.is_move;
}
MouseState.prototype.getWheelDelta = function() {
	return this.wheel_delta;
}
MouseState.prototype.isWheel = function() {
	return Global.MOUSE_WHEEL_STOP_LIMIT < Math.abs(this.wheel_delta);
}
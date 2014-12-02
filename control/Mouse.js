//
// Mouse class
//
function Mouse(target_element)
{
	/// private parameter
	click_coord_ 	= [];
	release_coord_ 	= [];
	offset_coord_ 	= [];
	move_coord_ 	= [];
	backup_coord_ 	= [];
	is_click_ 		= false;
	is_press_ 		= false;
	is_move_ 		= false;
	is_release_ 	= false;
	is_press_prev_ 	= false;
	click_kind_ 	= null;
	wheel_delta_ 	= 0;

	target_element.on({
		mousedown: function(e) {
			if (click_kind_)
				return;
			is_click_ = true;
			click_coord_[0] = e.pageX - $(this).offset().left;
			click_coord_[1] = e.pageY - $(this).offset().top;
			click_kind_ = e.which;
		},
		mouseup: function(e) {
			if (click_kind_ != e.which)
				return;
			is_release_ = true;
			release_coord_[0] = e.pageX - $(this).offset().left;
			release_coord_[1] = e.pageY - $(this).offset().top;
			click_kind_ = null;
		},
		mousemove: function(e) {
			if (is_press_prev_ && is_press_) {
				offset_coord_[0] = (e.pageX - $(this).offset().left) - click_coord_[0];
				offset_coord_[1] = (e.pageY - $(this).offset().top) - click_coord_[1];
			}
		},
		mouseleave: function(e) {
			is_release_ = true;
			backup_coord_[0] = backup_coord_[1] = 0;
			click_kind_ = null;
		}
	});
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	target_element.on(mousewheelevent, function(e){
		var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
		wheel_delta_ += delta < 0 ? ControlManager.MOUSE_WHEEL_POWER : -ControlManager.MOUSE_WHEEL_POWER;
	});


	return {
		// get the mouse click coordinate
		getClickCoord : function getClickCoord() {
			return click_coord_;
		},
		// get the mouse up coordinate
		getReleaseCoord : function getReleaseCoord() {
			return release_coord_;
		},
		// (while dragging)get the subtract current mouse coodinate from click coordinate
		getOffsetCoord : function getOffsetCoord() {
			return offset_coord_;
		},
		// get the movement that difference between mouse coordinate in previous frame
		getMoveCoord : function getMoveCoord() {
			return move_coord_;
		},
		// get the offset coordinate in previous frame 
		// getBackupCoord : function getBackupCoord() {
		// 	return backup_coord_;
		// },
		// get the mouse button type that was pressed
		getClickKind : function getClickKind() {
			return click_kind_;
		},
		// check whether a mouse button is clicking
		isClick : function isClick() {
			return !is_press_prev_ && is_press_;
		},
		// check whether a mouse button is hold down
		isHold : function isHold() {
			return is_press_prev_ && is_press_;
		},
		// check whether a mouse button is releasing
		isRelease : function isRelease() {
			return is_press_prev_ && !is_press_;
		},
		// check whether a mouse wheel is moving
		isWheel : function isWheel() {
			return ControlManager.MOUSE_WHEEL_STOP_LIMIT < Math.abs(wheel_delta_);
		},
		// // check whether a 
		// isLeave = function isLeave() {
		// 	return this.isRelease();
		// }
		// check whether a mouse dragging
		isMove : function isMove() {
			return is_move_;
		},
		// get a mouse wheel move value
		getWheelDelta : function getWheelDelta() {
			return wheel_delta_;
		},
		update : function update(option)
		{
			// mouse wheel control
			if (this.isWheel()) {
				wheel_delta_ *= ControlManager.MOUSE_WHEEL_DEC_RATE;
			}

			// mouse button control
			if (is_release_) {
				is_click_ 	= false;
				is_release_ = false;
				is_press_ 	= false;
				is_move_ 	= false;
				return;
			} else if(is_click_) {
				is_click_ 	= false;
				is_release_ = false;
				is_press_ 	= true;
				backup_coord_[0] = backup_coord_[1] = 0;
				offset_coord_[0] = offset_coord_[1] = 0;
				return;
			} else if (this.isHold()) {
				// マウスが動いているかどうか検出する
				if (backup_coord_[0] != offset_coord_[0] 
					|| backup_coord_[1] != offset_coord_[1]) {
					is_move_ 		= true;
					move_coord_[0] 	= offset_coord_[0] - backup_coord_[0];
					move_coord_[1] 	= offset_coord_[1] - backup_coord_[1];
					backup_coord_[0] = offset_coord_[0];
					backup_coord_[1] = offset_coord_[1];
					return;
				}
			}
			is_move_ = false;
			is_press_prev_ = is_press_;

		},
	};
}


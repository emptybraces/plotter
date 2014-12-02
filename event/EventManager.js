//
// EventManager class
//
var EventManager = (function(){

    /// private properties
    var timer_id_resize_ = null;
    var timer_id_tb_reflection_ = null;
    var current_focus_element_id_ = null;
    var current_focus_element_class_ = null;
    var option_icon_id_ = 1;

    /// constants properties

    /// private methods
    // canvas resizing
    function canvasResizing()
    {
        var w = $("#canvas_area").width();
        var h = $("#canvas_area").height();
        $("#canvas").attr("width", w); 
        $("#canvas").attr("height", h); 
        $("#canvas").css("width", w);
        $("#canvas").css("height", h);
        CommonManager.setClientWidth(w);
        CommonManager.setClientHeight(h);
        Adp.GL.viewport(0, 0, w, h);
    }

    // window resize event handler
    function windowResizeEventHandler()
    {
        if (timer_id_resize_ != null) {
            clearTimeout(timer_id_resize_);
        }
        timer_id_resize_ = setTimeout(function() {
            canvasResizing();
        }, CommonManager.WINDOW_RESIZE_EVENT_DELAY);

    }

    // textbox change event
    function textBoxChangeEventHandler()
    {
        var value = Number($(this).val());
        if (!value) {
            return;
        }
        var exceptNumber = $(this).val().match(/\D+/g);
        var maxlength = $(this).attr("maxlength");
        if ( !exceptNumber || (exceptNumber.length == 1 && exceptNumber[0] == ".")) {
            var fixed_value = value.toFixed(maxlength - 2);
            $(this).parent().next().children().text(Util.restrictLength(fixed_value, maxlength));
            switch(current_focus_element_id_) {
                case "object_position_x_tb": ObjectManager.getSelected().ins.setPosition({x:value}); break;
                case "object_position_y_tb": ObjectManager.getSelected().ins.setPosition({y:value}); break;
                case "object_position_z_tb": ObjectManager.getSelected().ins.setPosition({z:value}); break;
                case "object_scale_x_tb": ObjectManager.getSelected().ins.setScale({x:value}); break;
                case "object_scale_y_tb": ObjectManager.getSelected().ins.setScale({y:value}); break;
                case "object_scale_z_tb": ObjectManager.getSelected().ins.setScale({z:value}); break;
                case "env_axisline_length_tb": 
                    ObjectManager.getObjectByName("axisx")[0].ins.setPosition([-value, 0, 0], [value, 0, 0]);
                    ObjectManager.getObjectByName("axisy")[0].ins.setPosition([0, -value, 0], [0, value, 0]);
                    ObjectManager.getObjectByName("axisz")[0].ins.setPosition([0, 0, -value], [0, 0, value]);
                    break;
                case "env_gridline_interval_tb":
                    if (value <= 0) return;
                    var gridline = ObjectManager.getObjectByName("gridline")[0].ins;
                    gridline.setGridLineInterval(value);
                    gridline.calculate(value, gridline.getGridLineLength());
                    break;
                case "env_gridline_length_tb":
                    if (value <= 0) return;
                    var gridline = ObjectManager.getObjectByName("gridline")[0].ins;
                    gridline.setGridLineLength(value);
                    gridline.calculate(value, gridline.getGridLineInterval());
                    break;
                case "env_camera_fovy_tb":
                    CameraManager.getCurrentCamera().setFovy(value * Util.DEG2RAD);
                    break;
                case "env_camera_nearclip_tb":
                    CameraManager.getCurrentCamera().setNearClip(value);
                    break;
                case "env_camera_farclip_tb":
                    CameraManager.getCurrentCamera().setFarClip(value);
                    break;
                default:
                    console.error("not focused any element.");
            }
        } else {
            return;
        }
    }

    // color textbox change event
    function textBoxChangeEventHandlerColor()
    {
        var value = Number($(this).val());
        if (!value && value < 0) {
            return;
        }
        var exceptNumber = $(this).val().match(/\D+/g);
        var maxlength = $(this).attr("maxlength");
        if (!exceptNumber) {
            value = Math.min(255, value);
            $(this).parent().next().children().text(Util.restrictLength(value, maxlength));
            $(this).val(value);
        } else {
            return;
        }

        var ins = ObjectManager.getSelected().ins;
        switch(current_focus_element_id_) {
            case "object_color_r_tb": ins.setColor({r:value/255}); break;
            case "object_color_g_tb": ins.setColor({g:value/255}); break;
            case "object_color_b_tb": ins.setColor({b:value/255}); break;
        }
        ins.isBufferUpdate(true);
    }

    // alpha textbox change event
    function textBoxChangeEventHandlerAlpha(e)
    {
        var value = Number($(this).val());
        if (!value && value < 0) {
            return;
        }
        var exceptNumber = $(this).val().match(/\D+/g);
        var maxlength = $(this).attr("maxlength");
        if ( !exceptNumber || (exceptNumber.length == 1 && exceptNumber[0] == ".")) {
            value = Math.min(1.0, value);
            $(this).parent().next().children().text(Util.restrictLength(value, maxlength));
            $(this).val(value);
        } else {
            return;
        }

        var ins = ObjectManager.getSelected().ins;
        switch(current_focus_element_id_) {
            case "object_color_a_tb": ins.setColor({a:value}); break;
        }
        ins.isBufferUpdate(true);
    }

    // textbox focusin event handler
    function textBoxFocusinEventHandler()
    {
        // console.log("call textBoxFocusinEventHandler")
        current_focus_element_id_ = $(this).attr("id");
        current_focus_element_class_ = $(this).attr("class");
        timer_id_tb_reflection_ = setTimeout(
            (function(){textBoxValueReflectEvent()}),
            CommonManager.TEXTBOX_VALUE_REFLECT_TIME);
    }

    // textbox focusout event handler
    function textBoxFocusoutEventHandler()
    {
        // console.log("call textBoxFocusoutEventHandler")
        clearTimeout(timer_id_tb_reflection_);
    }

    // reflection textbox value
    function textBoxValueReflectEvent()
    {
        // console.log("call textBoxValueReflectEvent", e.data.current_focus_element_id_);
        $("#" + current_focus_element_id_).trigger("change");
        timer_id_tb_reflection_ = setTimeout(
            (function(){textBoxValueReflectEvent()}),
            CommonManager.TEXTBOX_VALUE_REFLECT_TIME);
    }

    // textbox keyup event handler
    function TextBoxKeyupEventHandler()
    {
        clearTimeout(timer_id_tb_reflection_);
        timer_id_tb_reflection_ = setTimeout(
            (function(){textBoxValueReflectEvent()}),
            CommonManager.TEXTBOX_VALUE_REFLECT_TIME);
    }

    // Option Icon click event handler
    function optionIconClickEventHandler(e)
    {
        // 0: none
        // 1: object paramter
        // 2: environment parameter
        var currentId = option_icon_id_;
        if (currentId != 0) {
            $("#object_parameter").css("visibility", "hidden");
            $("#environment_parameter").css("visibility", "hidden");
        }
        switch(e.target.id) {
            case "object_parameter_icon":
                if (currentId == 1) {
                    currentId = 0;
                } else {
                    currentId = 1;
                    $("#object_parameter").css("visibility", "visible");
                }
                break;
            case "env_parameter_icon":
                if (currentId == 2) {
                    currentId = 0;
                } else {
                    currentId = 2;
                    $("#environment_parameter").css("visibility", "visible");
                }
                break;
        }
        option_icon_id_ = currentId;
    }
    // axisline checkbox change event handler
    function checkBoxChangeEventHandler(e)
    {
        switch(e.target.id){
            case "env_axisline_x_cb": ObjectManager.getObjectByName("axisx")[0].opt.drawable = $(this).prop("checked"); break;
            case "env_axisline_y_cb": ObjectManager.getObjectByName("axisy")[0].opt.drawable = $(this).prop("checked"); break;
            case "env_axisline_z_cb": ObjectManager.getObjectByName("axisz")[0].opt.drawable = $(this).prop("checked"); break;
            case "env_gridline_cb":   ObjectManager.getObjectByName("gridline")[0].opt.drawable = $(this).prop("checked"); break;
        }
    }

    /// object
    return {
        //
        // initialize process
        //
        initialize : function initialize()
        {
            canvasResizing();

            var eventHandlerParam = {};
            $(".object_position_tb").on({
                    change : textBoxChangeEventHandler,
                    focusin : textBoxFocusinEventHandler,
                    focusout : textBoxFocusoutEventHandler,
                    keyup : TextBoxKeyupEventHandler,
                });
            $(".object_color_tb").on({
                    change : textBoxChangeEventHandlerColor,
                    focusin : textBoxFocusinEventHandler,
                    focusout : textBoxFocusoutEventHandler,
                    keyup : TextBoxKeyupEventHandler,
                });
            $(".object_alpha_tb").on({
                    change : textBoxChangeEventHandlerAlpha,
                    focusin : textBoxFocusinEventHandler,
                    focusout : textBoxFocusoutEventHandler,
                    keyup : TextBoxKeyupEventHandler,
                });
            $(".object_scale_tb").on({
                    change : textBoxChangeEventHandler,
                    focusin : textBoxFocusinEventHandler,
                    focusout : textBoxFocusoutEventHandler,
                    keyup : TextBoxKeyupEventHandler,
                });
            $("#environment_parameter input[type='checkbox'")
                .on("change", checkBoxChangeEventHandler);


            $("#option_icon").on("click", optionIconClickEventHandler);

            $("#environment_parameter input[type='text']").on({
                change : textBoxChangeEventHandler,
                focusin : textBoxFocusinEventHandler,
                focusout : textBoxFocusoutEventHandler,
                keyup : TextBoxKeyupEventHandler,
            });

            $(window).on("resize", windowResizeEventHandler);
        },
        //
        // MouseDown event handler
        //
        mouseDownEventHandler : function mouseDownEventHandler()
        {
            var mouse = ControlManager.mouse();
            switch(mouse.getClickKind()) {
                case ControlManager.MOUSE_BUTTON_TYPE_L:
                    ObjectManager.unselect();
                    var click_coord = mouse.getClickCoord();
                    var object = ObjectManager.objectPicking(
                        click_coord[0], 
                        CommonManager.getClientHeight() - click_coord[1]);
                    object ? this.objectSelectedEvent(object) : this.objectUnselectedEvent();
                    break;
            }
        },
        //
        // MouseUp event handler
        //
        mouseUpEventHandler : function MouseUpEventHandler()
        {
            Util.changeMouseCursorIcon("canvas", "move");
        },
        //
        // MouseLeave event handler
        //
        mouseLeaveEventHandler : function MouseLeaveEventHandler()
        {
            Util.changeMouseCursorIcon("canvas", "move");
        },
        //
        // MouseMove event handler
        //
        mouseMoveEventHandler : function mouseMoveEventHandler()
        {
            var camera      = CameraManager.getCurrentCamera();
            var mouse       = ControlManager.mouse();
            var selected    = ObjectManager.getSelected();

            // rounding camera 
            if (!selected) {
                var power = ControlManager.MOUSE_SMOOTH_POWER;
                // camera move value
                var mx = mouse.getMoveCoord()[0] * power;
                var my = mouse.getMoveCoord()[1] * power;
                camera.round(-mx, -my, 0);
                // reset condition
                var cam_pos = camera.getPosition();
                var distanceOriginYAxisFromCamPos = 
                    Math.pow(cam_pos[0], 2) + 0 + Math.pow(cam_pos[2], 2);
                // if exceed the limit, return the rotation in equivalence
                if (distanceOriginYAxisFromCamPos < Math.pow(CommonManager.CAMERA_NEAR_LIMIT, 2)) {
                    camera.round(0, my, 0);
                }
            }
            // moving object
            else {
                var ins = selected[0].ins;
                var click_x = mouse.getClickCoord()[0];
                var click_y = mouse.getClickCoord()[1];
                var mouse_x = click_x + mouse.getOffsetCoord()[0];
                var mouse_y = click_y + mouse.getOffsetCoord()[1];
                var intersectPoint = Adp.Vec3.create();
                // get the ray that screen coordinate
                var pmtx    = camera.perspective();
                var vmtx    = camera.lookAt();
                var from    = Util.screen2World(pmtx, vmtx, click_x, click_y, CommonManager.getClientWidth(), CommonManager.getClientHeight(), 0.1, 1.0);
                var to      = Util.screen2World(pmtx, vmtx, mouse_x, mouse_y, CommonManager.getClientWidth(), CommonManager.getClientHeight(), 1.0, 1.0);
                // test
                var ray = ObjectManager.getObjectByName("ray")[0];
                ray.ins.setPosition(from, to);
                ray.opt.drawable = true;
                // intersect plane and ray
                var range_square = ObjectManager.getObjectByName("ObjectMoveRangeSquare")[0].ins;
                var is_intersect = range_square.intersectRay(from, to, intersectPoint);
                if (!is_intersect) {
                    return;
                }
                // move object
                switch(CommonManager.OBJECT_MOVE_TYPE) {
                    case 'XY': ins.setPosition({x:intersectPoint[0], y:intersectPoint[1]}); break;
                    case 'XZ': ins.setPosition({x:intersectPoint[0], z:intersectPoint[2]}); break;
                    case 'YZ': ins.setPosition({y:intersectPoint[1], z:intersectPoint[2]}); break;
                }
                // print parameter
                ObjectManager.printObjectParameter();
                
            }
        },
        // object selected event
        objectSelectedEvent : function ObjectSelectedEvent(selectedObject)
        {
            // notify ther object manager
            ObjectManager.select(selectedObject);
            // update move range
            ObjectManager.getObjectByName("ObjectMoveRangeSquare")[0].ins.updatePosition();
            // update cursor icon
            Util.changeMouseCursorIcon("canvas", "default");
            // textbox enabled
            $("#object_parameter :input[type='text']").prop( "disabled", false );
            // print the object parameter
            ObjectManager.printObjectParameter();
        },
        //
        // object unselected event
        //
        objectUnselectedEvent : function ObjectUnselectedEvent()
        {
            // textbox disabled
            $("#object_parameter :input[type='text']").prop( "disabled", true );
        },
        /// constants
        
    }
})();



//
// window resize event handler
//
function WindowResizeEventHandler(e)
{
    if (e.data.resizeTimerId !== null) {
        clearTimeout(e.data.resizeTimerId);
    }
    e.data.resizeTimerId = setTimeout(function() {
        CanvasResizing(e.data.gl);
    }, Global.WINDOW_RESIZE_EVENT_DELAY);

}
//
// canvas resizing
//
function CanvasResizing(gl)
{
    var w = $("#canvas_area").width();
    var h = $("#canvas_area").height();
    $("#canvas").attr("width", w); 
    $("#canvas").attr("height", h); 
    $("#canvas").css("width", w);
    $("#canvas").css("height", h);
    Global.CLIENT_WIDTH = w;
    Global.CLIENT_HEIGHT = h;
    gl.viewport(0, 0, w, h);
}
//
// MouseDown event handler
//
function MouseDownEventHandler(param)
{
    var mouse = param.mouse;

    switch(mouse.getClickKind()) {
        case 1:
            param.objMgr.unselect();
            var objParam = param.objMgr.objectPicking(
                param.shader,
                mouse.getClickCoord()[0],
                mouse.getClickCoord()[1]);
            if (objParam) {
                ObjectSelectedEvent(param, objParam);
            } else {
                ObjectUnselectedEvent(param);
            }
           break;
        case 3:
            // console.log("mousedown right");
            break;
        default: break;
    }
}

//
// MouseUp event handler
//
function MouseUpEventHandler(param)
{
	Util.changeMouseCursorIcon("canvas", "move");
    if (param.selectedObjectParam) {
        // param.selectedObjectParam.opt.selected = false;
        // param.objMgr.getName("ObjectMoveRangeSquare")[0].opt.drawable = false;
        // param.selectedObjectParam = null;
    }
}

//
// MouseLeave event handler
//
function MouseLeaveEventHandler(param)
{
	Util.changeMouseCursorIcon("canvas", "move");
    if (param.selectedObjectParam) {
        // param.selectedObjectParam.opt.selected = false;
        // param.objMgr.getName("ObjectMoveRangeSquare")[0].opt.drawable = false;
        // param.selectedObjectParam = null;
    }
}

//
// MouseMove event handler
//
function MouseMoveEventHandler(param)
{
    var camera = param.objMgr.getCurrentCamera();
    var mouse = param.mouse;

    // camera mode
    if (!param.selectedObjectParam) {
        var power = Global.MOUSE_SMOOTH_POWER;
        // camera move value
        var mx = mouse.getMoveCoord()[0] * power;
        var my = mouse.getMoveCoord()[1] * power;
        camera.round(-mx, my, 0);
        // reset condition
        var cam_pos = camera.getPosition();
        var distanceOriginYAxisFromCamPos = Math.pow(cam_pos[0], 2) + 0 + Math.pow(cam_pos[2], 2);
        // if exceed the limit, return the rotation in equivalence
        if (distanceOriginYAxisFromCamPos < Math.pow(Global.CAMERA_NEAR_LIMIT, 2)) {
            camera.round(0, -my, 0);
        }
    }
    // move object mode
    else {
        var obj = param.selectedObjectParam.ins;
        var clickX = mouse.getClickCoord()[0];
        var clickY = mouse.getClickCoord()[1];
        var mouseX = clickX + mouse.getOffsetCoord()[0];
        var mouseY = clickY + mouse.getOffsetCoord()[1];
        var intersectPoint = Adp.Vec3.create();
        // get the ray that screen coordinate
        var pmtx    = camera.perspective();
        var vmtx    = camera.lookAt();
        var from    = Util.screen2World(pmtx, vmtx, clickX, clickY, param.gl.canvas.width, param.gl.canvas.height, 0.1, 1.0);
        var to      = Util.screen2World(pmtx, vmtx, mouseX, mouseY, param.gl.canvas.width, param.gl.canvas.height, 1.0, 1.0);
        // intersect plane and ray
        var rangeSquare = param.objMgr.getName("ObjectMoveRangeSquare")[0].ins;
        // var isMove = Intersect.polygonAndRay(
        //     intersectPoint, from, to, rangeSquare.getPolygon().getPosition(), rangeSquare.getNormal());
        var isMove = rangeSquare.intersectRay(from, to, intersectPoint);
        if (!isMove) {
            return;
        }
        // move object
        switch(Global.OBJECT_MOVE_TYPE) {
            case 'XY': obj.setPosition({x:intersectPoint[0], y:intersectPoint[1]}); break;
            case 'XZ': obj.setPosition({x:intersectPoint[0], z:intersectPoint[2]}); break;
            case 'YZ': obj.setPosition({y:intersectPoint[1], z:intersectPoint[2]}); break;
        }
        // print parameter
        param.objMgr.printObjectParameter();
        
        // test
        var ray = param.objMgr.getName("ray")[0];
        ray.ins.setPosition(from, to);
        ray.opt.drawable = true;
        // var p = new Polygon([-5.0,  5.0, 0.0, 
        //                      -5.0, -5.0, 0.0,
        //                       5.0,  5.0, 0.0
        //                     ]);
        // intersectPoint = Adp.Vec3.create();
        // console.log(Intersect.polygonAndRay(intersectPoint, from, to, p), intersectPoint);
        // ray.ins.setPosition(from, to);


    }
}

//
// textbox change event
//
function TextBoxChangeEventHandler(e)
{
    var value = Number($(this).val());
    if (!value) {
        return;
    }
    var exceptNumber = $(this).val().match(/\D+/g);
    var maxlength = $(this).attr("maxlength");
    if ( !exceptNumber || (exceptNumber.length == 1 && exceptNumber[0] == ".")) {
        var fixed_value = value.toFixed(maxlength - 2);
        $(this).parent().next().text(Util.restrictLength(fixed_value, maxlength));
        switch(e.data.currentFocusElementId) {
            case "object_position_x_tb": e.data.selectedObjectParam.ins.setPosition({x:value}); break;
            case "object_position_y_tb": e.data.selectedObjectParam.ins.setPosition({y:value}); break;
            case "object_position_z_tb": e.data.selectedObjectParam.ins.setPosition({z:value}); break;
            case "object_scale_x_tb": e.data.selectedObjectParam.ins.setScale({x:value}); break;
            case "object_scale_y_tb": e.data.selectedObjectParam.ins.setScale({y:value}); break;
            case "object_scale_z_tb": e.data.selectedObjectParam.ins.setScale({z:value}); break;
            case "env_axisline_length_tb": 
                e.data.objMgr.getName("axisx")[0].ins.setPosition([-value, 0, 0], [value, 0, 0]);
                e.data.objMgr.getName("axisy")[0].ins.setPosition([0, -value, 0], [0, value, 0]);
                e.data.objMgr.getName("axisz")[0].ins.setPosition([0, 0, -value], [0, 0, value]);
                break;
            case "env_gridline_interval_tb":
                if (value <= 0) return;
                Global.GRIDLINE_INTERVAL = value;
                e.data.objMgr.getName("gridline")[0].ins.calculate(Global.GRIDLINE_INTERVAL, Global.GRIDLINE_LENGTH);
                break;
            case "env_gridline_length_tb":
                if (value <= 0) return;
                Global.GRIDLINE_LENGTH = value;
                e.data.objMgr.getName("gridline")[0].ins.calculate(Global.GRIDLINE_INTERVAL, Global.GRIDLINE_LENGTH);
                break;
            case "env_camera_fovy_tb":
                Global.CAMERA_FOVY = value * Deg2Rad;
                break;
            case "env_camera_nearclip_tb":
                Global.CAMERA_NEAR_CLIP = value;
                break;
            case "env_camera_farclip_tb":
                Global.CAMERA_FAR_CLIP = value;
                break;
        }
    } else {
        return;
    }
}

//
// color textbox change event
//
function TextBoxChangeEventHandlerColor(e)
{
    var value = Number($(this).val());
    if (!value && value < 0) {
        return;
    }
    var exceptNumber = $(this).val().match(/\D+/g);
    var maxlength = $(this).attr("maxlength");
    if (!exceptNumber) {
        value = Math.min(e.data.MAX_VALUE_COLOR, value);
        $(this).parent().next().text(Util.restrictLength(value, maxlength));
        $(this).val(value);
    } else {
        return;
    }
    switch(e.data.currentFocusElementId) {
        case "object_color_r_tb": e.data.selectedObjectParam.ins.setColor({r:value/255}); break;
        case "object_color_g_tb": e.data.selectedObjectParam.ins.setColor({g:value/255}); break;
        case "object_color_b_tb": e.data.selectedObjectParam.ins.setColor({b:value/255}); break;
    }
    e.data.selectedObjectParam.ins.isBufferUpdate(true);
}
//
// alpha textbox change event
//
function TextBoxChangeEventHandlerAlpha(e)
{
    var value = Number($(this).val());
    if (!value && value < 0) {
        return;
    }
    var exceptNumber = $(this).val().match(/\D+/g);
    var maxlength = $(this).attr("maxlength");
    if ( !exceptNumber || (exceptNumber.length == 1 && exceptNumber[0] == ".")) {
        value = Math.min(e.data.MAX_VALUE_COLOR, value);
        $(this).parent().next().text(Util.restrictLength(value, maxlength));
        $(this).val(value);
    } else {
        return;
    }
    switch(e.data.currentFocusElementId) {
        case "object_color_a_tb": e.data.selectedObjectParam.ins.setColor({a:value}); break;
    }
    e.data.selectedObjectParam.ins.isBufferUpdate(true);
}

//
// textbox focusin event handler
//
function TextBoxFocusinEventHandler(e)
{
    console.log("call TextBoxFocusinEventHandler")
    e.data.currentFocusElementId = $(this).attr("id");
    e.data.currentFocusElementClass = $(this).attr("class");
    e.data.reflectTbTimerId = setTimeout(
        (function(){TextBoxValueReflectEvent(e)}), Global.TEXTBOX_VALUE_REFLECT_TIME);
}

//
// textbox focusout event handler
//
function TextBoxFocusoutEventHandler(e)
{
    console.log("call TextBoxFocusoutEventHandler")
    clearTimeout(e.data.reflectTbTimerId);
}

//
// reflection textbox value
//
function TextBoxValueReflectEvent(e)
{
    console.log("call TextBoxValueReflectEvent", e.data.currentFocusElementId);

    $("#" + e.data.currentFocusElementId).trigger("change");
    e.data.reflectTbTimerId = setTimeout(
        (function(){TextBoxValueReflectEvent(e)}), Global.TEXTBOX_VALUE_REFLECT_TIME);
}

//
// textbox keyup event handler
//
function TextBoxKeyupEventHandler(e)
{
    clearTimeout(e.data.reflectTbTimerId);
    e.data.reflectTbTimerId = setTimeout(
        (function(){TextBoxValueReflectEvent(e)}), Global.TEXTBOX_VALUE_REFLECT_TIME);
}

//
// text click event handler
//
function TextMouseDownEventHandler(e)
{

}
//
// text mouseup event handler
//
function TextMouseupEventHandler(e)
{

}

//
// object selected event
//
function ObjectSelectedEvent(eParam, selectedObjectParam)
{
    // set parameter
    eParam.selectedObjectParam = selectedObjectParam;
    // notify object manager
    eParam.objMgr.select(selectedObjectParam);
    // moverange update
    eParam.objMgr.getName("ObjectMoveRangeSquare")[0].ins.updatePosition(eParam.objMgr);
    // update cursor icon
    Util.changeMouseCursorIcon("canvas", "default");
    // textbox enabled
    $("#object_parameter :input[type='text']").prop( "disabled", false );
    // remove cursor focus
    // $("input").blur();
    // print the object parameter
    eParam.objMgr.printObjectParameter();
}

//
// object unselected event
//
function ObjectUnselectedEvent(eParam)
{
    // set parameter
    eParam.selectedObjectParam = null;
    // textbox disabled
    $("#object_parameter :input[type='text']").prop( "disabled", true );
}

//
// Option Icon click event handler
//
function OptionIconClickEventHandler(e)
{
    // 0: none
    // 1: object paramter
    // 2: environment parameter
    var currentId = e.data.optionAreaId;
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
    e.data.optionAreaId = currentId;
}
//
// axisline checkbox change event handler
//
function CheckBoxChangeEventHandler(e)
{
    switch(e.target.id){
        case "env_axisline_x_cb": e.data.objMgr.getName("axisx")[0].opt.drawable = $(this).prop("checked"); break;
        case "env_axisline_y_cb": e.data.objMgr.getName("axisy")[0].opt.drawable = $(this).prop("checked"); break;
        case "env_axisline_z_cb": e.data.objMgr.getName("axisz")[0].opt.drawable = $(this).prop("checked"); break;
        case "env_gridline_cb":   e.data.objMgr.getName("gridline")[0].opt.drawable = $(this).prop("checked"); break;
    }
}
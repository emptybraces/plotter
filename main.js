function test(){
}

$( document ).ready(function() 
{
    test();
	// canvas要素を取得
	var c = document.getElementById("canvas");
    // webglコンテキストを取得
    var gl = /*c.getContext("webgl") || */ c.getContext("experimental-webgl", {preserveDrawingBuffer: true});
    if(!gl) {
    	alert("WebGL is not supported on your device");
    	return;
    }

    // canvas size setting
    CanvasResizing(gl);

    // object instantiate
    var loopProcess = new LoopProcess(Global.FPS);

    var shader = new Shader(gl);

   	var camera = new Camera(
   		Global.INITIAL_CAMERA_POSITION,
   		Global.INITIAL_CAMERA_TARGET, 
   		Global.INITIAL_CAMERA_UPDIR);

   	var mouse = new MouseState($("#canvas"));

    var object_list = new ObjectList(gl);
    if (object_list.initialize() == -1) {
        console.log("ObjectList:initialize failed.");
        return;
    }

    // geomtery initalize
    Geometry.initialize(gl);

    // shader setting
    var result = null;
    ["vs_line"
    ,"vs_point"
    ,"vs_obj"
    ,"vs_objtex"
    ,"vs_boundary"
    ,"fs_simple"
    ,"fs_obj"
    ,"fs_objtex"
    ].forEach(function(elem){
        if (!shader.compile(elem)) {
            Util.assert(false, "shader source compile failed. shader id is" + shaderId);
            result = -1;
        }
    });

    if (result == -1) {
        return;
    }

    if (shader.attach("vs_line", "fs_simple", "shader_line", ShaderLine) == -1){
        console.error("shader source attach failed");
        return;
    }
    if (shader.attach("vs_point", "fs_simple", "shader_point", ShaderPoint) == -1){
        console.error("shader source attach failed");
        return;
    }
    if (shader.attach("vs_obj", "fs_obj", "shader_obj", ShaderObject, [false]) == -1){
        console.error("shader source attach failed");
        return;
    }
    if (shader.attach("vs_objtex", "fs_objtex", "shader_objtex", ShaderObject, [true]) == -1){
        console.error("shader source attach failed");
        return;
    }
    if (shader.attach("vs_boundary", "fs_simple", "shader_boundary", ShaderBoundary, [true]) == -1){
        console.error("shader source attach failed");
        return;
    }

    // element setting on event handler
    // event handler common paramter
    var eventHandlerParam = {};
    $(".object_position_tb").on({
            change : TextBoxChangeEventHandler,
            focusin : TextBoxFocusinEventHandler,
            focusout : TextBoxFocusoutEventHandler,
            keyup : TextBoxKeyupEventHandler,
        }, eventHandlerParam);
    $(".object_color_tb").on({
            change : TextBoxChangeEventHandlerColor,
            focusin : TextBoxFocusinEventHandler,
            focusout : TextBoxFocusoutEventHandler,
            keyup : TextBoxKeyupEventHandler,
        }, eventHandlerParam);
    $(".object_alpha_tb").on({
            change : TextBoxChangeEventHandlerAlpha,
            focusin : TextBoxFocusinEventHandler,
            focusout : TextBoxFocusoutEventHandler,
            keyup : TextBoxKeyupEventHandler,
        }, eventHandlerParam);
    $(".object_scale_tb").on({
            change : TextBoxChangeEventHandler,
            focusin : TextBoxFocusinEventHandler,
            focusout : TextBoxFocusoutEventHandler,
            keyup : TextBoxKeyupEventHandler,
        }, eventHandlerParam);
    $("#environment_parameter input[type='checkbox'")
        .on("change", eventHandlerParam, CheckBoxChangeEventHandler);

    $(window).on("resize", eventHandlerParam, WindowResizeEventHandler);

    $("#option_icon").on("click", eventHandlerParam, OptionIconClickEventHandler);

    $("#environment_parameter input[type='text']").on({
        change : TextBoxChangeEventHandler,
        focusin : TextBoxFocusinEventHandler,
        focusout : TextBoxFocusoutEventHandler,
        keyup : TextBoxKeyupEventHandler,
    }, eventHandlerParam);

    // context menu initialize
    InitializeContextMenu(eventHandlerParam);


    // user code
    var red = [1.0, 0.0, 0.0, 1.0];
    var green = [0.0, 1.0, 0.0, 1.0];
    var blue = [0.0, 0.0, 1.0, 1.0];
    var white = [1.0, 1.0, 1.0, 1.0];
    var grey = [0.5, 0.5, 0.5, 1.0];
    var yellow = [1.0, 1.0, 0.0, 1.0];
    var square_color = [0.9, 0.6, 0.8, 0.2];
    object_list.add(new GridLine("shader_line"), {name:"gridline"});
    object_list.add(new Line("shader_line", [-Global.AXISLINE_LENGTH, 0.0, 0.0], [Global.AXISLINE_LENGTH, 0.0, 0.0], red, red), {name:"axisx"});
    object_list.add(new Line("shader_line", [0.0, -Global.AXISLINE_LENGTH, 0.0], [0.0, Global.AXISLINE_LENGTH, 0.0], green, green), {name:"axisy"});
    object_list.add(new Line("shader_line", [0.0, 0.0, -Global.AXISLINE_LENGTH], [0.0, 0.0, Global.AXISLINE_LENGTH], blue, blue), {name:"axisz"});
    // object_list.add(new Sphere([-2.0, 0.0, 0.0], red, 1.0, "shader_obj"), {name:"red"});
    // object_list.add(new Sphere([0.0, 2.0, 0.0], blue, 1.0, "shader_obj"), {name:"blue"});
    // object_list.add(new Sphere([0.0, 0.0, 2.0], white, 1.0, "shader_obj"), {name:"white"});
    // object_list.add(new Sphere([0.0, 0.0, 0.0], green, 1.0, "shader_obj"), {name:"green"});
    object_list.add(new Line("shader_line", [0.0, 0.0, 0.0], [10.0, 10.0, 0.0], green, green), {name:"ray", drawable:false});
    object_list.add(new ObjectMoveRange("shader_obj"), {name:"ObjectMoveRangeSquare", drawable:false});
    object_list.add(new Square("shader_obj", [0, 0.5*5, -10], blue, 1.5, 1.0,  5.0), {name:"square"});
    object_list.add(new Point("shader_point", [5, 0, -8], red, 10), {name:"point"});
    object_list.add(new Point("shader_point", [8, 0, -5], yellow, 20), {name:"point"});
    object_list.add(new Point("shader_point", [-1, 1, 0], blue, 10), {name:"point"});
    object_list.add(new Point("shader_point", [-1, 0, 1], blue, 10), {name:"point"});
    object_list.add(new Point("shader_point", [-1, -1, 0], blue, 10), {name:"point"});
    object_list.add(new Point("shader_point", [-1, 0, -1], blue, 10), {name:"point"});
    var cube = Geometry.get("cube", {});
    cube.setPosition([10, 0, 0]);
    object_list.add(cube, {});
    var sphere1 = Geometry.get("sphere", {});
    sphere1.setPosition([8, 0, 5]);
    object_list.add(sphere1, {});

    // var plane = new Model(gl, "shader_objtex", "plane");
    // object_list.add(plane, {});
    
    var CONCRETE_BARRIER_OPT = {
        shader: {
            BOUND_BOX: {
                name: "bound_box",
                id: "shader_boundary",
                drawable: true,
                   uniforms: {
                        color: [1.0, 1.0, 1.0, 0.2]
                   } 
            },
            CONCRETE_BARRIER: {
                name: "concrete_barrier",
                id: "shader_objtex"
            },
        },
    };
    var concrete_barrier = new Model(gl, null, "concrete_barrier", CONCRETE_BARRIER_OPT);
    concrete_barrier.setScale([2.0, 2.0, 2.0]);
    concrete_barrier.setPosition([-8.0, 0.0, 5.0]);
    // concrete_barrier.setRotate([0, 1, 0], Math.PI);
    object_list.add(concrete_barrier, {});

    object_list.sort(camera);
    // intialize matrix
    var vMatrix = Adp.Mtx4.identity();
    var pMatrix = Adp.Mtx4.identity();
    
    // setting the event handler common parameter
    eventHandlerParam.mouse = mouse;
    eventHandlerParam.gl = gl;
    eventHandlerParam.camera = camera;
    eventHandlerParam.objMgr = object_list; 
    eventHandlerParam.shader = shader; 
    eventHandlerParam.pMtx = pMatrix; 
    eventHandlerParam.vMtx = vMatrix;
    eventHandlerParam.selectedObjectParam = null;
    eventHandlerParam.reflectTbTimerId = null;
    eventHandlerParam.resizeTimerId = null;
    eventHandlerParam.MAX_VALUE_COLOR = 255;
    eventHandlerParam.MAX_VALUE_ALPHA = 1.0;
    eventHandlerParam.currentFocusElementId = null;
    eventHandlerParam.currentFocusElementClass = null;
    eventHandlerParam.optionAreaId = 1;
   
    // setting the environment
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.enable(gl.CULL_FACE);
    //gl.frontFace(gl.CCW);

    // main loop process
    var cnt = 0;
    loopProcess.loop(
        (function(){
            // cnt += 0.1;
            // cnt = cnt % 360;
            // concrete_barrier.setRotate([0,1,0], Deg2Rad * cnt)
            // // var scale = cnt / (360 / 5); 
            // concrete_barrier.setScale([5, 15, 15]);

            // update
            camera.lookAt(vMatrix);
            camera.perspective(pMatrix);
            mouse.update();
            if (mouse.isClick()) {
                MouseDownEventHandler(eventHandlerParam);
            } else if(mouse.isRelease()) {
                MouseUpEventHandler(eventHandlerParam);
            } else if(mouse.isMove()) {
                MouseMoveEventHandler(eventHandlerParam);
            } else if(mouse.isLeave()) {
                MouseLeaveEventHandler(eventHandlerParam);
            }
            if (mouse.isWheel()) {
                var delta = 1.0 + mouse.getWheelDelta();
                var cam_pos = camera.getPosition();
                cam_pos[0] *= delta
                cam_pos[1] *= delta
                cam_pos[2] *= delta
                // console.log(delta);
            }

            object_list.update();
            // draw
            object_list.draw(shader, pMatrix, vMatrix);
        })
    );
});

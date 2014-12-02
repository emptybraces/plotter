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

    // manager initialize
    CommonManager.initialize(gl);
    EventManager.initialize(); // canvas resizing 
    ObjectManager.initialize();
    ControlManager.initialize();
    GeometryManager.initialize();

    // object instantiate
    var loopProcess = new LoopProcess(CommonManager.FPS);

    // shader setting
    var result = null;
    ["vs_line"
    ,"vs_point"
    ,"vs_obj"
    ,"vs_objtex"
    ,"vs_boundary"
    ,"vs_2dplane"
    ,"fs_simple"
    ,"fs_obj"
    ,"fs_objtex"
    ,"fs_2dplane"
    ].forEach(function(elem){
        if (!ShaderManager.compile(elem)) {
            Util.assert(false, "shader source compile failed. shader id is '" + elem+ "'");
        }
    });

    if (!ShaderManager.attach("vs_line", "fs_simple", "shader_line", ShaderLine)){
        Util.assert(false, "shader source attach failed");
        return;
    }
    if (!ShaderManager.attach("vs_point", "fs_simple", "shader_point", ShaderPoint)){
        Util.assert(false, "shader source attach failed");
        return;
    }
    if (!ShaderManager.attach("vs_obj", "fs_obj", "shader_obj", ShaderObject)){
        Util.assert(false, "shader source attach failed");
        return;
    }
    if (!ShaderManager.attach("vs_objtex", "fs_objtex", "shader_objtex", ShaderObjectTexture)){
        Util.assert(false, "shader source attach failed");
        return;
    }
    if (!ShaderManager.attach("vs_boundary", "fs_simple", "shader_boundary", ShaderBoundary)){
        Util.assert(false, "shader source attach failed");
        return;
    }
    if (!ShaderManager.attach("vs_2dplane", "fs_2dplane", "shader_2dplane", Shader2DPlane)){
        Util.assert(false, "shader source attach failed");
        return;
    }

    // construct the context menu
    InitializeContextMenu();

    // user code
    var red = [1.0, 0.0, 0.0, 1.0];
    var green = [0.0, 1.0, 0.0, 1.0];
    var blue = [0.0, 0.0, 1.0, 1.0];
    var white = [1.0, 1.0, 1.0, 1.0];
    var grey = [0.5, 0.5, 0.5, 1.0];
    var yellow = [1.0, 1.0, 0.0, 1.0];
    CameraManager.add(new Camera("shader_boundary", {
        position: CommonManager.DEFAULT_CAMERA_POSITION,
        target: CommonManager.DEFAULT_CAMERA_TARGET,
        updir: CommonManager.DEFAULT_CAMERA_UPDIR,}),
        {name:"camera1"});
    ObjectManager.add(new GridLine("shader_line"), {name:"gridline"});
    var l = CommonManager.DEFAULT_AXISLINE_LENGTH;
    ObjectManager.add(new Line("shader_line", [-l, 0.0, 0.0], [l, 0.0, 0.0], red, red), {name:"axisx"});
    ObjectManager.add(new Line("shader_line", [0.0, -l, 0.0], [0.0, l, 0.0], green, green), {name:"axisy"});
    ObjectManager.add(new Line("shader_line", [0.0, 0.0, -l], [0.0, 0.0, l], blue, blue), {name:"axisz"});
    ObjectManager.add(new Line("shader_line", [0.0, 0.0, 0.0], [10.0, 10.0, 0.0], green, green), {name:"ray", drawable:false});
    ObjectManager.add(new ObjectMoveRange("shader_obj"), {name:"ObjectMoveRangeSquare", drawable:false});
    ObjectManager.add(GeometryManager.get("plane", {position:[0, 0.5*5, -10], color:blue, sidew:7.5, sideh:5.0, }), {name:"plane"});
    ObjectManager.add(GeometryManager.get("point", {position:[5, 0, -8], color:red, size:10}), {name:"point"});
    ObjectManager.add(GeometryManager.get("point", {position:[8, 0, -5], color:yellow, size:20}), {name:"point"});
    ObjectManager.add(GeometryManager.get("point", {position:[-1, 1, 0], color:blue, size:10}), {name:"point"});
    ObjectManager.add(GeometryManager.get("plane", {position:[-8, 0, -5], color:red, scale:[4, 5, 5], text:"ビルボードXYZ", billboardType:0}), {name:"billboard"});
    ObjectManager.add(GeometryManager.get("plane", {position:[-10, 0, 0], color:red, scale:[5, 5, 5], text:"ビルボードY", billboardType:1}), {name:"billboardy"});
    var cube = GeometryManager.get("cube", {position:[10, 0, 0]});
    ObjectManager.add(cube, {});
    var sphere1 = GeometryManager.get("sphere", {position: [8, 0, 5]});
    ObjectManager.add(sphere1, {});

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
        rotate:{axis:CommonManager.AXISY, rad:Math.PI/2}
    };
    var concrete_barrier = new Model(null, "concrete_barrier", CONCRETE_BARRIER_OPT);
    concrete_barrier.setScale([2.0, 2.0, 2.0]);
    concrete_barrier.setPosition([-8.0, 0.0, 5.0]);
    // concrete_barrier.setRotate([0, 1, 0], Math.PI);
    ObjectManager.add(concrete_barrier, {});

    ObjectManager.add(new Plane2D("shader_2dplane", {position:[0, 0], color:red, text:"スクリーン", sidew:0.1, sideh:0.2,}), {name:"2dplane"});
    // sort
    ObjectManager.sort();
   
    // setting the environment
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.enable(gl.CULL_FACE);
    //gl.frontFace(gl.CCW);

    // main loop process
    loopProcess.loop(
        (function(){

            // update
            CameraManager.update();
            ControlManager.update();
            ObjectManager.update();

            // draw
            ObjectManager.draw();
        })
    );
});

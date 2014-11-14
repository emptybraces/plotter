//
// Shader class
//
function Shader(gl) {
	this.gl = gl;
    this.source = {};
    this.shader = {};
    this.currentShaderId = null;

}
Shader.prototype.compile = function compile(id) {
    
    if (!id) {
        console.error("invalid parameter");
        return null;
    }

    // HTMLからscriptタグへの参照を取得
    var scriptElement = document.getElementById(id);
    
    // scriptタグが存在しない場合は抜ける
    if(!scriptElement){return;}
    
    var shader;

    // scriptタグのtype属性をチェック
    switch(scriptElement.type){
        
        // 頂点シェーダの場合
        case 'x-shader/x-vertex':
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
            break;
            
        // フラグメントシェーダの場合
        case 'x-shader/x-fragment':
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            break;
        default :
            return;
    }
    
    // 生成されたシェーダにソースを割り当てる
    this.gl.shaderSource(shader, scriptElement.text);
    
    // シェーダをコンパイルする
    this.gl.compileShader(shader);
    
    // シェーダが正しくコンパイルされたかチェック
    if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
        
        // 成功していたらシェーダを返して終了
        this.source[id] = shader;
        return shader;
    }else{
        
        // 失敗していたらエラーログをアラートする
        console.error(this.gl.getShaderInfoLog(shader));
        return null;
    }
}
Shader.prototype.attach = function attach(vs, fs, shaderId, shaderObject, args)
{
	// プログラムオブジェクトの生成
    var program = this.gl.createProgram();
    
    // プログラムオブジェクトにシェーダを割り当てる
    this.gl.attachShader(program, this.source[vs]);
    this.gl.attachShader(program, this.source[fs]);
    
    // シェーダをリンク
    this.gl.linkProgram(program);

    // シェーダのリンクが正しく行なわれたかチェック
    if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
    
        // 成功していたらプログラムオブジェクトを有効にする
        this.gl.useProgram(program);

        this.shader[shaderId] = new shaderObject(this.gl, program, args);
        this.currentShaderId = shaderId;

        // プログラムオブジェクトを返して終了
        return program;
    }else{
        
        // 失敗していたらエラーログをアラートする
        console.error(this.gl.getProgramInfoLog(program));
        return -1;
    }
}

Shader.prototype.switchShader = function switchShader(shaderId)
{
    var shader = this.getShader(shaderId);
    if(this.currentShaderId != shaderId) {
        this.currentShaderId = shaderId;
        this.gl.useProgram(shader.getProgram());
    }
    return shader;
}

Shader.prototype.getShader = function getShader(shaderId)
{
    var shader = this.shader[shaderId];
    Util.assert(shader != null, "unassign shader id is: " + shaderId);
    return shader;
}
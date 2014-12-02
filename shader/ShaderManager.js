//
// ShaderManager class
//
var ShaderManager = (function ShaderManager() {
	// private property
    sources_ = {};
    shaders_ = {};
    current_shader_id_ = null;

    // private function
    function getShader(id)
    {
        var shader = shaders_[id];
        Util.assert(shader != null, "unassigned shader id: " + id);
        return shader;
    }

    return {
        // compile the shader
        compile : function compile(id) {
            // gets a script tag
            var scriptElement = document.getElementById(id);
            if(!scriptElement){
                Util.error("can not found script element.");
                return null;
            }
            // create shader
            var shader = Adp.GL.createShader(scriptElement.type, scriptElement.text);
            if (!shader)
                return null;

            sources_[id] = shader;
            return shader;
        },
        // attach the shader
        attach : function attach(vs, fs, id, shaderClass)
        {
            // attaches Shader Object to Program Object
            var program = Adp.GL.attachShaders2Program(sources_[vs], sources_[fs]);
            if (!program)
                return null;
            if (shaders_.hasOwnProperty(id)) {
                Util.warn("specified shader id has been already registered.");
            }

            shaders_[id] = new shaderClass(program);
            return shaders_[id];
        },
        // switching the current enable shader
        switchShader : function switchShader(id)
        {
            var shader = getShader(id);
            if(current_shader_id_ != id) {
                current_shader_id_ = id;
                Adp.GL.useProgram(shader.getProgram());
            }
            return shader;
        },
    };
})();


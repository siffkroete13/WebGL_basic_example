import { MyUtil } from './utils/my-util';

var Log = (function() {
    var myUtil = MyUtil.getInstance();

	function Log() {}
	
    Log.prototype.logCache = [];

    Log.prototype.cacheLog = function(msg) {
        this.logCache.push(msg);
    }

    Log.prototype.flushLog = function() {
        console.log(this.logCache.join('\n'));
        this.logCache = [];
    }

    Log.prototype.log = function(...args) {
        for (let i = 0; i < args.length; i += 2) {
            const value = args[i];
            this.cacheLog(`${this.stringify(value)}`);
        }
    }

	Log.prototype.logProgram = function(gl, program) {
		const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
        const infoLog = gl.getProgramInfoLog(program);

        this.cacheLog(`Program Link Status: ${linkStatus}`);
        if (!linkStatus) {
            console.error(`Program Info Log:\n${infoLog}`);
        }

        const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        this.cacheLog(`Number of Active Attributes: ${numAttributes}`);
        for (let i = 0; i < numAttributes; i++) {
            const attribInfo = gl.getActiveAttrib(program, i);
            this.cacheLog(`Attribute ${i}: Name: ${attribInfo.name}, Type: ${attribInfo.type}, Size: ${attribInfo.size}`);
        }

        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        this.cacheLog(`Number of Active Uniforms: ${numUniforms}`);
        for (let i = 0; i < numUniforms; i++) {
            const uniformInfo = gl.getActiveUniform(program, i);
            this.cacheLog(`Uniform ${i}: Name: ${uniformInfo.name}, Type: ${uniformInfo.type}, Size: ${uniformInfo.size}`);
        }
	}

    Log.prototype.logShader = function(gl, shader) {
        const shaderType = gl.getShaderParameter(shader, gl.SHADER_TYPE);
        const shaderSource = gl.getShaderSource(shader);
        const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        const infoLog = gl.getShaderInfoLog(shader);
    
        this.cacheLog(`Shader Type: ${shaderType === gl.VERTEX_SHADER ? 'VERTEX_SHADER' : 'FRAGMENT_SHADER'}`);
        this.cacheLog(`Shader Source:\n${shaderSource}`);
        this.cacheLog(`Compile Status: ${compileStatus}`);
        if (!compileStatus) {
            this.cacheLog(`Shader Info Log:\n${infoLog}`);
        }
    }

    Log.prototype.logWebGLContext = function(gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            this.cacheLog(`Vendor: ${vendor}`);
            this.cacheLog(`Renderer: ${renderer}`);
        } else {
            this.cacheLog('WEBGL_debug_renderer_info not supported');
        }
    
        const version = gl.getParameter(gl.VERSION);
        const shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        const extensions = gl.getSupportedExtensions();
    
        this.cacheLog(`WebGL Version: ${version}`);
        this.cacheLog(`Shading Language Version: ${shadingLanguageVersion}`);
        this.cacheLog('Supported Extensions:', extensions);
    }
    
    Log.prototype.logWebGLObject = function(gl, obj) {
        if (obj instanceof WebGLShader) {
            logShader(gl, obj);
        } else if (obj instanceof WebGLProgram) {
            logProgram(gl, obj);
        } else if (obj instanceof WebGLRenderingContext) {
            logWebGLContext(obj);
        } else {
            this.cacheLog('Unsupported WebGL object:', obj);
        }
    }

    Log.prototype.stringify = function(value, indent = 2, depth = 0) {
        if (depth > 5) { // Limitiert die Rekursionstiefe
            return '[Max Depth Reached]';
        }
    
        if (value === null) {
            return 'null';
        } else if (typeof value === 'undefined') {
            return 'undefined';
        } else if (typeof value === 'string') {
            return `"${value}"`;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
            return value.toString();
        } else if (Array.isArray(value)) {
            const nested = value.map(item => this.stringify(item, indent, depth + 1)).join(', ');
            return `[${nested}]`;
        } else if (typeof value === 'object') {
            const nested = Object.keys(value)
                .map(key => `${' '.repeat(depth * indent)}${key}: ${this.stringify(value[key], indent, depth + 1)}`)
                .join(',\n');
            return `{\n${nested}\n${' '.repeat((depth - 1) * indent)}}`;
        } else {
            return value.toString();
        }
    }

    Log.prototype.logMat = function(...args) {
        for (let i = 0; i < args.length; i += 2) {
            const mat = args[i];
            this.cacheLog(mat);
        }
    }
    
	
	return new Log();
	
})();

export {Log}
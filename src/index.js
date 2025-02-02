import { MyUtil } from './utils/my-util';
import { mat4 } from 'gl-matrix';

// Start here
function main() {
	const canvas = document.querySelector('#meineWebGLCanvas');
	const gl = canvas.getContext('webgl');
	
	// If we don't have a GL context, give up now
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	// Vertex shader program
	const vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexColor;
		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;
		varying lowp vec4 vColor;
		void main(void) {
			gl_PointSize = 5.0;
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			vColor = aVertexColor;
		}
	`;

	// Fragment shader program
	const fsSource = `
		varying lowp vec4 vColor;
		void main(void) {
		  gl_FragColor = vColor;
		}
	`;

	// Initialize a shader program; this is where all the lighting for the vertices and so forth is established.
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	
	// Collect all the info needed to use the shader program. Look up which attributes our shader program is using
	// for aVertexPosition, aVertexColor and also look up uniform locations.
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
		  vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		  vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
		  projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
		  modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		},
	};

  	// Initialize the buffers we'll need
	const positionBuffer = gl.createBuffer();
	
	// Select the positionBuffer as the one to apply buffer operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	// Now create an array of positions
	const positions = [
		 1.0,  1.0, -0.0,
		-1.0,  1.0, -0.0,
		 1.0, -1.0, -0.0,
		-1.0, -1.0, -0.0,
	];
	
	// Now pass the list of positions into WebGL to build the shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
	// Now set up the colors for the vertices
	var colors = [
		0.0,  0.0,  0.0,  1.0,    
		0.0,  0.0,  0.0,  1.0,    
		0.0,  0.0,  0.0,  1.0,    
		0.0,  0.0,  0.0,  1.0,   
	];
	
	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	
	const buffers = {
		position: positionBuffer,
		color: colorBuffer,
	};

  	// Draw the scene
  	drawScene(gl, programInfo, buffers);
}





// Draw the scene.
function drawScene(gl, programInfo, buffers) {
	gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
	
	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Create a perspective matrix, a special matrix that is used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height  ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units and 100 units away from the camera.
	const fieldOfView = 45 * (Math.PI / 180);
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

  	// note: glmatrix.js always has the first argument as the destination to receive the result.
 	mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  	// Set the drawing position to the "identity" point, which is the center of the scene.
  	const modelViewMatrix = mat4.create();

  	// Now move the drawing position a bit to where we want to start drawing the square.
  	mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [0.0, 0.0, -6]);  // amount to translate
	
	const angle = 45 * (Math.PI / 180);
	mat4.rotate(modelViewMatrix, modelViewMatrix, angle, [0, 0, 1]);

  	// Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
  	{
		const numComponents = 3; // Dimension der Positions-Vektoren (3 Dimensionen normalerweise: x, y, z) aber auch 2-D möglich.
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexPosition);
  	}

  	// Tell WebGL how to pull out the colors from the color buffer into the vertexColor attribute.
  	{
		const numComponents = 4; // r, g, b, alpha = 4 Werte
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexColor);
  	}

  	// Tell WebGL to use our program when drawing
  	gl.useProgram(programInfo.program);

  	// Set the shader uniforms
  	gl.uniformMatrix4fv(
      	programInfo.uniformLocations.projectionMatrix,
      	false,
      	projectionMatrix
	);
  	gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
	);

  	{
		const offset = 0;
		const vertexCount = 4;
		const gl_primitives = gl.POINTS; 
		// const gl_primitives = gl.TRIANGLE_STRIP
		gl.drawArrays(gl_primitives, offset, vertexCount);
  	}
}


// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}


// creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


// Ein kleiner Hack damit die Start-Funktion erst aufgerufen wird, nachdem DOM geladen ist.
(function r(f) {
    /in/.test(document.readyState) ? setTimeout(function() { r(f);}, 9) : f()
})(main);
	    
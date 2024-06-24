'use strict'


var MyUtil = (function() {
	function Util() {}
	
	// Dies ist die komplette Projektions-Matrix (Perspective-Projextion-Matrix). Alle Koordinaten der Vertices im Frustum werden richtig
	// in den Bereich von -1 zu 1 projeziert. Auch die Tatsache, dass aspect ration nicht gleich 1 ist wird beachtet durch diese Matrix.
	// Auch die z-Koordinaten werden zwischen -1 und 1 projeziert (für allfälliges weg clippen oder so).
	// Anfangs dachte ich, dass was fehlt, z.B. die Zentrierung von apex (Kamera) oder so. Aber diese Funktion ist nur für für zentrierte Kamera zugelassen.
	// Dann dachte ich auch, dass ja das Ganze auf ein clipping volume projeziert werden muss (clipping volume: Würfel von -1 zu 1) und dass 
	// das dem Aspect Ratio wiederspricht, weil aspect ratio kann auch nicht gleich 1 sein. Aber es wird in den Formeln ebenfalls beachtet wie ich raus fand.
	Util.prototype.getProjectionMat4 = function(fov, aspect_ratio, zNear, zFar) {
		
		var angle = fov / 2.0;
		
		// Vorsicht, die Spalten hier sind die Zeilen der eigentlichen Matrix, keine Ahnung warum das so ist, ist ne wegbl Sache, nicht meine Schuld.
		var projectionMatrix = [
			1.0 / (aspect_ratio * Math.tan(angle) ),      	0.0, 						0.0, 									0.0,
			0.0,                                			1.0 / Math.tan(angle), 		0.0, 									0.0,
			0.0, 											0.0, 						-(zNear - zFar) / (zNear - zFar), 		-1.0,
			0.0, 											0.0, 						(2 * zFar * zNear) / (zNear - zFar), 	0.0
		];
	
		
		return projectionMatrix;
	}
	
	// Diese Funktion macht geanu das Gleiche wie getProjectionMat4(..) einfach mit anderen Argumenten.
	// Left und Right müssen gleich lang sein. Und auch top, bottom aber nur hier, im Allgemeinen müsste diese Funktion das auch beachten.
	// Falls die Kamera nicht im Zentrum steht (d.h. -left != right oder -bottom != top) dann müsste man die Funktion noch fertig schreiben.
	// In einem solchen Fall müsste man dann noch die Zentrierung der Kamera ausführen (Translate the apex of the frustum to the origin).
	// Die zentrierung der Kamera to the origin (apex ist die Kamera) kann man sich so vorstellen: Ist as apex nach rechts (x-Achse) verschoben, so schiebe 
	// man das Koordinatensystem auch nach Rechts Richtung der x-Achse so dass der Koordinaten-Ursprung auf das Apex zu liegen kommt. Als Folge verschieben
	// sich die Koordinaten der einzelnen Vertices nach "Links" der x-Achse nach, also ins Minus. Das Gleiche tue man natürlich für Y-Achse falls nötig.
	// Das "nach Rechts" könnte natürlich auch "nach Links" sein, das war nur ein Beispiel o.B.d.A. sozusagen.
	Util.prototype.getProjectionWithLeftRightTopBottomNearFarMat4 = function(left, right, bottom, top, near, far) {
		var fovy, aspect;
		
		fovy = 2 * toDegrees(Math.atan2(top, near));
		if (-left === right && -bottom === top ) {
			aspect = right / top; // width / height
		
			return this.createPerspective(fovy, aspect, near, far);
		}
	}
		
	
	Util.prototype.getOrthographicMat4 = function(left, right, bottom, top, zNear, zFar) {
		
		var orthographiMatrix = [
			2.0 / (right - left), 0.0, 0.0, 0.0,
			0.0, 2.0 / (top - bottom), 0.0, 0.0,
			0.0, 0.0, -2.0 / (zFar - zNear), 0.0,
			1.0, 1.0, -(zFar+zNear)/(zFar-zNear), 1.0
		]
		
		return orthographiMatrix;
	}
	
	Util.prototype.multiply = function(a, b) {
		
		var b00 = b[0 * 4 + 0];
		var b01 = b[0 * 4 + 1];
		var b02 = b[0 * 4 + 2];
		var b03 = b[0 * 4 + 3];
		var b10 = b[1 * 4 + 0];
		var b11 = b[1 * 4 + 1];
		var b12 = b[1 * 4 + 2];
		var b13 = b[1 * 4 + 3];
		var b20 = b[2 * 4 + 0];
		var b21 = b[2 * 4 + 1];
		var b22 = b[2 * 4 + 2];
		var b23 = b[2 * 4 + 3];
		var b30 = b[3 * 4 + 0];
		var b31 = b[3 * 4 + 1];
		var b32 = b[3 * 4 + 2];
		var b33 = b[3 * 4 + 3];
		var a00 = a[0 * 4 + 0];
		var a01 = a[0 * 4 + 1];
		var a02 = a[0 * 4 + 2];
		var a03 = a[0 * 4 + 3];
		var a10 = a[1 * 4 + 0];
		var a11 = a[1 * 4 + 1];
		var a12 = a[1 * 4 + 2];
		var a13 = a[1 * 4 + 3];
		var a20 = a[2 * 4 + 0];
		var a21 = a[2 * 4 + 1];
		var a22 = a[2 * 4 + 2];
		var a23 = a[2 * 4 + 3];
		var a30 = a[3 * 4 + 0];
		var a31 = a[3 * 4 + 1];
		var a32 = a[3 * 4 + 2];
		var a33 = a[3 * 4 + 3];
	 
		return [
		  b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
		  b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
		  b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
		  b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
		  b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
		  b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
		  b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
		  b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
		  b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
		  b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
		  b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
		  b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
		  b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
		  b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
		  b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
		  b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
		];
	  
	}

	Util.prototype.printMatrix4 = function(matrix, name = '') {
		// Assumes the matrix is a 4x4 matrix in column-major order (as used in WebGL)
		if (matrix.length !== 16) {
			console.error("Invalid matrix length. Expected a 4x4 matrix.");
			return;
		}
	
		const fieldSize = 10; // Size of each field for alignment
		console.log(name + ":");
		for (let i = 0; i < 4; i++) {
			let row = "";
			for (let j = 0; j < 4; j++) {
				// Format the number to a fixed width
				let num = matrix[j * 4 + i].toFixed(4);
				row += num.padStart(fieldSize, ' ') + " ";
			}
			console.log(row);
		}
	}
	
	var instance = null;
	
	return {
		getInstance: function() {
			if(instance === null) {
				instance = new Util();
			}
			return instance;
		}
	}
	
})();

export {MyUtil}
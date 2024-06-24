var CoordSystem = (function() {
	function CoordSystem() {
		const coord_data = {};
		coord_data['min_x'] = -1;
		coord_data['max_x'] = 1;
		coord_data['min_y'] = -10;
		coord_data['max_y'] = 10;
		coord_data['x_unit'] = 0.1;
		coord_data['y_unit'] = 1;
		coord_data['x_range'] = coord_data['max_x'] - coord_data['min_x'];
		coord_data['y_range'] = coord_data['max_y'] - coord_data['min_y'];
		coord_data['num_x_marks'] = coord_data['x_range'] / coord_data['x_unit'];
		coord_data['num_y_marks'] = coord_data['y_range'] / coord_data['y_unit'];
		
		const positions = [-1, 0, 0,
							1, 0, 0,
							0, 1, 0,
							0, -1, 0,
							0, 0, -1,
							0, 0, 1
						];
							
		coord_data['positions'] = positions;
		
		this.coord_data = coord_data;
	}
	
	CoordSystem.prototype.getPositions = function() {
		return this.coord_data['positions'];
	}
	
	return CoordSystem;
})()
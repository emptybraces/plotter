//
// Parser
//
var Parser = function Parser(){

	//
	// 
	//
	function includeIndices(binary, mode)
	{
		// extract the header part
		var offset = Uint32Array.BYTES_PER_ELEMENT * 1;
		var length = 4;
		var u32 = new Uint32Array(binary, offset, length);
		// header
		var header = u32;
		// console.log(String.fromCharCode(header[0])); // V
		var pos_data_count = header[1];
		// console.log(String.fromCharCode(header[2])); // N
		var normal_data_count = header[3];

		// extract the common header part
		offset += length * Uint32Array.BYTES_PER_ELEMENT;
		length = 2;
		var common_header = new Uint32Array(binary, offset, length);
		// console.log(String.fromCharCode(common_header[0])); // C
		var index_count = common_header[1];

		// extract the data part
		// position index
		offset += length * Uint32Array.BYTES_PER_ELEMENT;
		length = index_count;
		var pos_index = new Uint16Array(binary, offset, length);
		// console.log("position index:", pos_index.length, pos_index);
		// position data
		offset += length * Uint16Array.BYTES_PER_ELEMENT;
		length = pos_data_count;
		var pos_data = new Float32Array(binary, offset, length);
		// console.log("position data:", pos_data.length, pos_data);
		// normal index
		// offset += length * Float32Array.BYTES_PER_ELEMENT;
		// length = index_count;
		// var normal_index = new Uint16Array(binary, offset, length);
		// console.log("normal index:", normal_index.length, normal_index);
		// normal index
		offset += length * Float32Array.BYTES_PER_ELEMENT;
		length = normal_data_count;
		// console.log(offset, length)
		var normal_data = new Float32Array(binary, offset, length);

		// convert blender axis into opengl axis
		convertAxisBlender2Opengl(pos_data, normal_data);

		return {position: pos_data, normal: normal_data, index: pos_index, mode: mode};
	}
	//
	//
	//
	function normal(binary, mode)
	{
		// extract the header part
		var offset = Uint32Array.BYTES_PER_ELEMENT * 1;
		var length = 4;
		var u32 = new Uint32Array(binary, offset, length);
		// header
		var header = u32;
		// console.log(String.fromCharCode(header[0])); // V
		var pos_data_count = header[1];
		// console.log(String.fromCharCode(header[2])); // N
		var normal_data_count = header[3];

		// extract the common header part
		offset += length * Uint32Array.BYTES_PER_ELEMENT;
		length = 1;
		var common_header = new Uint32Array(binary, offset, length);
		// console.log(String.fromCharCode(common_header[0])); // C

		// extract the data part
		// position data
		offset += length * Uint32Array.BYTES_PER_ELEMENT;
		length = pos_data_count;
		var pos_data = new Float32Array(binary, offset, length);

		// normal data
		offset += length * Float32Array.BYTES_PER_ELEMENT;
		length = normal_data_count;
		var normal_data = new Float32Array(binary, offset, length);
		// convert blender axis into opengl axis
		convertAxisBlender2Opengl(pos_data, normal_data);

		return {position: pos_data, normal: normal_data, index: null, mode: mode};
	}
	//
	// convert blender axis into opengl axis
	//
	function convertAxisBlender2Opengl(positions, normals, texcoords)
	{
		var out = Adp.Vec3.create();
		// caluculate
		Util.convertArraySingle2Vec3(positions).forEach(function(elem, i) {
			out = Adp.Vec3.create();
	   		Adp.Vec3.rotateX(out, elem, [0, 0, 0], Deg2Rad * -90);
	   		positions[i*3+0] = out[0]; 
	   		positions[i*3+1] = out[1];
	   		positions[i*3+2] = out[2];
		});
		// reconvert to original
		// positions 	= Util.convertArrayMultiple2Single(pos3);

		// normals
		if (!Util.isUndefined(normals) && normals != null) {
			Util.convertArraySingle2Vec3(normals).forEach(function(elem, i) {
				out = Adp.Vec3.create();
		   		Adp.Vec3.rotateX(out, elem, [0, 0, 0], Deg2Rad * -90);
		   		normals[i*3+0] = out[0]; 
		   		normals[i*3+1] = out[1];
		   		normals[i*3+2] = out[2];
			});
			// normals = Util.convertArrayMultiple2Single(nor3);
		}
		// texcoord
		if (!Util.isUndefined(texcoords) && texcoords != null) {
			Util.convertArraySingle2Vec2(texcoords).forEach(function(elem, i) {
				out = Adp.Vec2.create(elem[0], elem[1]);
		   		texcoords[i*2+1] = 1 - out[1];
			});
		}
	}

	return {
		ModelDataParser : function ModelDataParser(binary)
		{
			// extract the mode value
			var offset = 0;
			var length = 1;
			var mode = new Uint32Array(binary, offset, length);
			switch(mode[0]){
				case 0: return includeIndices(binary, mode[0]); 	break;
				case 1: return normal(binary, mode[0]); 			break;
				default: Util.assert(false, "invalid mode in custom model data: mode is", mode[0]);
			}
		},
		modelDataMapList : function dataMapList(binary) 
		{
			var model_type = new Int32Array(binary, 0, 1)[0];
			var datamap_count = new Int32Array(binary, 4, 1)[0];
			var datamap_paths = String.fromCharCode.apply(null, new Uint8Array(binary, 8));
			datamap_paths = datamap_paths.split("\0", datamap_count);

			return {
				modelType: model_type,
				count: datamap_count,
				paths: datamap_paths
			};
		},
		modelDataMap : function modelData(binary, type)
		{
			var values = new Int32Array(binary);
			return {
				// modelType: values[0],
				positionValueCount: 	values[1],
				positionDataOffset: 	values[2],
				normalValueCount: 		values[3],
				normalDataOffset: 		values[4],
				texcoordValueCount: 	values[5],
				texcoordDataOffset: 	values[6],
				colorValueCount: 		values[7],
				colorDataOffset: 		values[8],
				materialCount: 			values[9]				
			}
		},
		modelData : function modelData(vertexBinary, materialbinary, mapData, type)
		{
			var position_vertices = new Float32Array(
				vertexBinary, 
				mapData.positionDataOffset,
				mapData.positionValueCount);
			// console.log(position_vertices.length);
			var normal_vertices = null;
			if (mapData.normalValueCount != -1) {
				normal_vertices = new Float32Array(
					vertexBinary,
					mapData.normalDataOffset,
					mapData.normalValueCount);
			}
			var texcoord_vertices = null;
			if (mapData.texcoordValueCount != -1) {
				texcoord_vertices = new Float32Array(
					vertexBinary,
					mapData.texcoordDataOffset,
					mapData.texcoordValueCount);
			}
			var color_vertices = null;
			if (mapData.colorValueCount != -1) {
				color_vertices = new Float32Array(
					vertexBinary,
					mapData.colorDataOffset,
					mapData.colorValueCount);
			}
			var material_data = null;
			if (mapData.materialCount != -1) {
				material_data = {};
				var image_names = String.fromCharCode.apply(null, new Uint8Array(materialbinary, 0));
				material_data.imageNames = image_names.split("\0", mapData.materialCount);
			}
			convertAxisBlender2Opengl(position_vertices, normal_vertices, texcoord_vertices);
			return {
				position: 	position_vertices,
				normal: 	normal_vertices,
				texcoord: 	texcoord_vertices,
				color: 		color_vertices,
				material: 	material_data
			}
		}
	}
}();

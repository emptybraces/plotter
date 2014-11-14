//
// Loader Class
//
var Loader = (function(){

	var ASSETS_PATH = "assets/";
	var REQUEST_RESULT_OK = 200;
	var REQUEST_RESULT_UNAUTHORIZED = 401;
	var REQUEST_RESULT_FORBIDDEN = 403;
	var REQUEST_RESULT_NOT_FOUND = 404;
	var REQUEST_RESULT_INTERNAL_SERVER_ERROR = 500;
	//
	// load
	//
	function load(filepath, type, async)
	{
		// deferred object
		var deferred = $.Deferred();
		// xhr
		var xhr = new XMLHttpRequest();
		xhr.responseType = type;
		// on load handler
		xhr.onload = function(e) {
			xhr.status === 200 ? 
				deferred.resolve(xhr.response) : 
				deferred.reject("xhr load error: " + xhr.status);
	    }
		xhr.open('GET', filepath, async);
		xhr.send();
		return deferred.promise();
	}

	function emptyDeferred()
	{
		return $.Deferred().resolve().promise();
	}

	function loadBinary(filepath, data)
	{
		var deferred = $.Deferred();
		var xhr = new XMLHttpRequest();
		xhr.responseType = "arraybuffer";
		xhr.onload = function(e) {
			if (xhr.status === REQUEST_RESULT_OK) { 
				if (Util.isUndefined(data)) {
					deferred.resolve(xhr.response);
				} else {
					deferred.resolveWith(data, [xhr.response]);
				}
			} else {
				deferred.reject("xhr load error: " + xhr.status);
			}
		}
		xhr.open('GET', filepath, true);
		xhr.send();
		return deferred.promise();
	}

	return {
		//
		// load
		//
		load: load,
		//
		// custom data loading
		//
		loadModel: function loadModel(modelName, thisObject, callback)
		{
			var result_data = [];
			var model_type = null;

			// datamap list
			var filepath = ASSETS_PATH + modelName + ".bin";
			var modelData =[];
			loadBinary(filepath, result_data).then(function(response)
			{
				// datamap
				var datamapList = Parser.modelDataMapList(response);
				model_type = datamapList.modelType;
				var loadMapFuncs = [];
				datamapList.paths.forEach(function(elem){
					var datamap_path = ASSETS_PATH + elem;
					console.log("loadfile: ", datamap_path);
					loadMapFuncs.push(loadBinary(datamap_path));
				});
				$.when.apply(null, loadMapFuncs).then(function(/*variable arguments*/){
					// load vertices data
					var geoDataLoadFuncs 	= [];
					Array.prototype.forEach.call(arguments, function(elem, i){
						var promises 		= [];
						var map 			= Parser.modelDataMap(elem);
						var vertex_path 	= ASSETS_PATH + datamapList.paths[i].replace("_datamap.bin", "_vertex.bin");
						var material_path 	= ASSETS_PATH + datamapList.paths[i].replace("_datamap.bin", "_material.bin");
						console.log("loadfile: ", vertex_path)
						promises.push(loadBinary(vertex_path));
						if (map.materialCount != -1) {
							promises.push(loadBinary(material_path));
							console.log("loadfile: ", material_path)
						}
						geoDataLoadFuncs.push({
							promises: promises,
							mapData: map,
							geometryName: datamapList.paths[i].split("/").pop().replace("_datamap.bin", "")
						});
					});

					function parseModelData(resultData, geoName, mapData, responseVertex, responseMaterial) {
						var geometry_data = Parser.modelData(responseVertex, responseMaterial, mapData);
						resultData.push({
							geometryName: geoName,
							geometryData: geometry_data
						});
					}
					var promise = emptyDeferred();
					geoDataLoadFuncs.forEach(function(elem) {
						promise = promise.then(function() {
								return $.when.apply(null, elem.promises).then( function(resVertex, resMaterial){
									parseModelData(result_data, elem.geometryName, elem.mapData, resVertex, resMaterial);
								});
						});
					});
					promise.done(function(){
						callback.call(thisObject, result_data, model_type);
					});
				});
			});
		}
	}
})();

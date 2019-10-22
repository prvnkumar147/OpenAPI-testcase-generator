const fs = require('fs');

const generateCustomValues = (swagg) => {
    const swaggPaths = swagg.paths
    var respJson = {
    	params: [],
    };

    Object.keys(swaggPaths).forEach( function(getEndpoints) {
    	var endPoint = swaggPaths[getEndpoints]
    	//var endPointName = getEndpoints.split("/")[1].toUpperCase()
    	var endPointName = getEndpoints.replace(/\//g, "_")
    								   .replace(/[{}]/g, "")
    								   .substr(1)
    								   .toUpperCase();
    	//console.log(getendpoints)
    	//console.log(endPoint)
    	// See EP is already exits in untimate response object
		if (!respJson[getEndpoints]) {
			respJson[getEndpoints] = {};
		}
		var epObj = respJson[getEndpoints];

    	Object.keys(endPoint).forEach( function(getOperations){
    		var operationsTypes = endPoint[getOperations]
    		var opType = getOperations.toUpperCase()
    		//console.log(operationsTypes)
    		const swaggResp = operationsTypes.responses

    		//console.log(swaggResp)
			// See if operation type is already exists or not
			if (!epObj[getOperations]) {
				epObj[getOperations] = {};
			}
			var op = epObj[getOperations];

    		Object.keys(swaggResp).forEach(function(getResponses){
    			//var resp = swaggResp[getResponses]
    			var isParamExists=true;
        		var endPointCopy = `${getEndpoints}`;
				var paramIndex = 1;
				var testParams = {};
				var testCaseId = `${endPointName}_${opType}_${getResponses}`
				// See if resp code exist
				if (!op[getResponses]) {
					op[getResponses] = {};
				}

				var respCode = op[getResponses];
				if (!respCode["query"]) {
					respCode["query"] = {};
				}
				if (!respCode["path"]) {
					respCode["path"] = {};
				}
				
				if (operationsTypes.parameters){
					operationsTypes.parameters.forEach(parameter => {
		    			var inParam = "query";
		    			if (parameter["in"]) {
		    				inParam = parameter["in"];
		    			}
		    			var paramId = `${testCaseId}_${parameter["name"].toUpperCase()}`;
		    			
		    			if (inParam == "query") {
		    				var query = respCode["query"];
		    				query[parameter["name"]] = paramId;		    						    				
		    			} else if (inParam == "path"){
		    				var path = respCode["path"];
		    				path[parameter["name"]] = paramId;		    					    				
		    			}
		    			var paramType = "string";
		    			var eg = ""
		    			if (parameter["schema"]) {
		    				paramSchema = parameter["schema"]
		    				paramType = paramSchema.type
		    				//console.log(paramType);
		    				if (paramType == 'array') {
		    					eg = '[arr1,arr2,...]'
		    				}
		    			}
		    			//Pushing to params array in respJson object to print the params in csv in testgen1
		    			//respJson['params'].push(paramId);
		    			respJson['params'].push([paramId,paramType,"",eg]);
					});					
				}
				//Adding code for handling request body param
				if (operationsTypes.requestBody){
						var reqBody = operationsTypes.requestBody
						//console.log(reqBody)
						if (reqBody.content){
							Object.keys(reqBody).forEach(function(reqbodycontent){
								//console.log(reqbodycontent);
								var reqContent = reqBody[reqbodycontent]
								//var reqContent = reqBody.content
								//console.log(reqContent)
								Object.keys(reqContent).forEach(function(mediaTypeVal){
									var mediaType = reqContent[mediaTypeVal]
									//console.log(mediaType)
									Object.keys(mediaType).forEach(function(reqSchema){
						 				var schema = mediaType[reqSchema]
						 				//console.log(schema)

						 				if(schema.type){
							 				if(schema.type != "object"){
							 					var type = schema.type
							 					console.log(type)
							 				} else{
							 					var type = schema.type
							 					var forExample = schema.properties
							 					console.log(forExample)
							 				}

							 			}
						 			// 	Object.keys(schema).forEach(function(reqType){
							 		// 		var requestType = schema[reqType]
							 		// 		console.log(requestType)
										// });
						 			});
								});
						    });				
						}							
				}
				//Handler for request body param ends here
    		});
    	});	
    });
    console.log(respJson)
    return respJson;
};

exports.generateCustomValues = generateCustomValues;

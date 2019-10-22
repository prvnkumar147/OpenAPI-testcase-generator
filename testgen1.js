const oatts = require('oatts');
const fs = require('fs')
const CustValGen = require('./custValGenV2.js');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
     path: 'out.csv',
	 header: [
	 {id: 'name', title: 'TestParam'},
	 {id: 'type', title: 'ParamType'},
	 {id: 'value', title: 'ParamValue'},
	 {id: 'example', title: 'ParamExample'},
	 ]
});
fs.readFile('./petstore30.json', 'utf8', (err, jsonString) => {
	var swaggJson = JSON.parse(jsonString);
	var customValues = CustValGen.generateCustomValues(swaggJson);
	var host;
	var scheme;

	if (swaggJson.servers && swaggJson.servers.length > 0) {
		var url = swaggJson.servers[0]["url"].split("://");
		scheme = url[0];
		host = url[1];
	}

	console.log(JSON.stringify(customValues));
	console.log(11111111111111111111111);


	var options = {
    // see "Options" section below for available options

    	'writeTo': "./test6",
    	'customValues': JSON.stringify(customValues),
	};

	if (host && scheme) {
		options.host = host;
		options.scheme = scheme;
	}

	var tests = oatts.generate('./petstore30.json', options);

	//Write to csv
	var paramsList = customValues.params
	var csvData = [];
	paramsList.forEach( (paramValue) => {
		var row = {
			'name': paramValue[0],
			'type': paramValue[1],
			'value': '',
			'example': paramValue[3],
		};
		csvData.push(row);
	});
	csvWriter.writeRecords(csvData);
});
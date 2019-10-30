const csv = require('csv-parser');
const fs = require('fs');
const path = require('path')
const Mocha = require('mocha')
const execFile = require("child_process").execFile;

const testFolder = './test6';
const writeDir = "./TestFilesReady"

const mocha = new Mocha();
//mocha.options.timeout = 15000;
mocha.options.opts = "./TestFilesReady/mocha.opts";

var testFilesReady = fs.readdirSync(testFolder);
const totalFiles = testFilesReady.length;
var fileIndex = 0;

testFilesReady.forEach(fn => {
    var rFile = `${testFolder}/${fn}`;
    var wFile = `${writeDir}/${fn}`;
    var fc = fs.readFileSync(rFile).toString();

	fs.createReadStream('out.csv')
		.pipe(csv())
		.on('data', (row) => {
	//console.log(row);
	if(row['TestParam'].includes("REQUEST_BODY")){
		var paramValue = row["ParamValue"].replace("“", '"')
			.replace("”", '"')
			.replace("‘", "'")
			.replace("’", "'")
		fc = fc.replace(`"${row['TestParam']}"`, paramValue);	
	} else{
		fc = fc.replace(row['TestParam'], row['ParamValue']);
	}
		
	}).on("end", (err) => {
		fs.writeFile(wFile, fc, (err) => {
			fileIndex = fileIndex + 1;

			if (!err) {
				console.log(`File written successfully => ${wFile}.`);
			}
			if (fileIndex == totalFiles) {
				console.log("Added all the tests files to Mocha...");
				execFile('/home/praveen/Projects/apitive-testcase-generator/node_modules/mocha/bin/mocha', ['--timeout 15000', '/home/praveen/Projects/apitive-testcase-generator/TestFilesReady/'], (error, stdout, stderr) => {
					if (error) {
						throw error;
					}
					console.log("STDOUT START:");
					console.log(stdout);
					console.log("STDOUT END");
				});
			}
		});
	});
});
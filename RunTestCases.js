const csv = require('csv-parser');
const fs = require('fs');
const path = require('path')
const Mocha = require('mocha')
const exec = require("child_process").exec;

const testFolder = './test6';
const writeDir = "./TestFilesReady"


fs.mkdirSync(writeDir);
fs.writeFile(writeDir+"/mocha.opts", "--timeout 15000", function(err) {
if(err) {
       console.log(err);
   }
})

const mocha = new Mocha();


var testFilesReady = fs.readdirSync(testFolder);
const totalFiles = testFilesReady.length;
var fileIndex = 0;

testFilesReady.forEach(fn => {
    var rFile = `${testFolder}/${fn}`;
    var wFile = `${writeDir}/${fn}`;
    var fc = fs.readFileSync(rFile).toString();

    //Replacing Test case ID in the generated code with the value provided in CSV

	fs.createReadStream('out.csv')
		.pipe(csv())
		.on('data', (row) => {
	
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

			//Running the generated test cases in command line using exec method
			
			if (fileIndex == totalFiles) {
				console.log("Added all the tests files to Mocha...");
				exec('./node_modules/mocha/bin/mocha --opts ./TestFilesReady/mocha.opts ./TestFilesReady/', (error, stdout, stderr) => {
				//console.log("STDOUT START:");
				console.log(stdout);
				//console.log("STDOUT END");
				});
			}
		});
	});
});
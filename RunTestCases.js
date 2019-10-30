const csv = require('csv-parser');
const fs = require('fs');
const path = require('path')
const Mocha = require('mocha')

const testFolder = './test6';
const writeDir = "./TestFilesReady"

fs.readdir(testFolder, (err, files) => {
    files.forEach(fn => {
	    var rFile = `${testFolder}/${fn}`;
	    var wFile = `${writeDir}/${fn}`;
	    var fc = fs.readFileSync(rFile).toString();

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
				if (!err) {
					console.log(`File written successfully => ${wFile}.`);
					var mocha = new Mocha();
					mocha.addFile(wFile)
					mocha.run();
				}
			});
		});
	});
	console.log(files);
});

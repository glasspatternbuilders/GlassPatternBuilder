var http = require('http');
var url = require('url');
var fs = require('fs-extra')
var parseString = require('xml2js').parseString;
var util = require('util');
var formidable = require('formidable');
const shell = require('shelljs');
var path = require('path');
const replace = require('replace-in-file');
var svg = require('svg.js');
var output;
var readline = require('readline')
// var lineReader = require('readline').createInterface({
//     input: fs.createReadStream(_dirname + '/file')
// });

//var output = fs.createWriteStream(_dirname + '/output.txt');


http.createServer(function (req, res)  {

    if ((req.url == '/home') && (req.method === 'POST')) {
        var form = new formidable.IncomingForm();
        form.parse(req,function(err, fields, files){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));
        });

        form.on('end', function(fields, files) {
            /* Temporary location of our uploaded file */
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[0].name;
            /* Location where we want to copy the uploaded file */
            var new_location = './server/potrace/';

            fs.copy(temp_path, new_location + file_name, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Saved bmp to file!");
                    sendToPotrace(new_location + file_name);
                }
            });
        });


        return;
    }
}).listen(8080);



function sendToPotrace(file){
    shell.exec('../../Potrace/potrace --svg --opaque ' + file);
    console.log("Converted bmp to svg!");
    var fileToRead = getFileName(file);
    var inputPath = getFullPath(fileToRead);

    addIdToSvg(inputPath, fileToRead);
}


// Function that adds ID to SVG File. ID is the same as found on bmp file on browser.
function addIdToSvg(inputPath, filename){

    console.log(inputPath);

    const options = {
        files: inputPath,
        from: '<svg ',
        to: '<svg id="' + filename + '" ',
    };

    replace(options)
        .then(changes => {
            console.log('Modified files:', changes.join(', '));
            modifySVGPath(inputPath, filename);

        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
}



function modifySVGPath(inputPath, filename) {
    var fullPath = inputPath;
    var dirname = './resources/patterns/svg_display/'
    var output = fs.createWriteStream(dirname + filename + '.svg');
    var lineReader = readline.createInterface({
        input: fs.createReadStream(fullPath)
    });

    var pathnumber = 0;

    lineReader.on('line', function(line){
        var toWrite = "";

        if(!line.startsWith("<path")){
            toWrite += line;
            toWrite += "\n";
            output.write(toWrite)
        }
        else if(line.startsWith("<path")){
          console.log('Line number ' + pathnumber + ': ' + line);
          var lineToEdit = line.split(' ');
          console.log(lineToEdit[0]);

          lineToEdit.splice(1, 0, 'id="' + pathnumber + '"');
          var editedLine = lineToEdit.join(' ');
          console.log(editedLine);
          pathnumber++;

          toWrite += editedLine;
          toWrite += "\n";
          output.write(toWrite)
    }

    })


}





function getXML(inputPath){

    fs.readFile(inputPath, 'utf-8', function (err, data){
        if(err) console.log(err);
        // we log out the readFile results
        console.log(data);
        // we then pass the data to our method here
        parseString(data, function(err, result){
            if(err) console.log(err);
            // here we log the results of our xml string conversion
            console.log(result);
        });
    });
}






// HELPER METHODS TO GET FILENAMES AND FILEPATHS

function getFileName(file){
    var filename = path.basename(file);
    var fullFilename = filename.split('.');
    var name = fullFilename[0];
    return name;
}

function getFullPath(file){
    let filePath = './server/potrace/';
    let fullFilePath = filePath + file + ".svg";
    return fullFilePath;
}



// DO NOT USE THESE FUNCTIONS - FOR REFERENCE AND TESTING ONLY

function readFile(file) {
    let filePath = './server/potrace/';
    let fullFilePath = filePath + file + ".svg";
    fs.readFile(fullFilePath,"utf-8",function(err,contents){
        if (err) error(err);
        else {
            processFile(contents);
        }
    });
}

function processFile(text) {
   // var item = svg(text);
    console.log(text);
   // return item;
    //text = text.toUpperCase();
    //process.stdout.write(text);

}

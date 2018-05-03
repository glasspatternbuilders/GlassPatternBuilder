var http = require('http');
var url = require('url');
var fs = require('fs-extra');
var util = require('util');
var formidable = require('formidable');
const shell = require('shelljs');

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
                    console.log("success!")
                    shell.exec('../../Potrace/potrace --svg --opaque ./server/potrace/bird.bmp');
                }
            });
        });


        return;
    }
}).listen(8080);

//TODO implement function for sending multiple files to potrace

//TODO add ID markup language to each retrieved svg - entire pattern

//TODO add the other markup language needed in the SVG - individual pieces

//TODO place the marked up items in the proper folder



function readFile() {
    let filePath = './resources/tests/dolphin.svg';
    fs.readFile(filePath,"utf-8",function(err,contents){
        if (err) error(err);
        else {
            processFile(contents);
        }
    });
}

function processFile(text) {


    text = text.toUpperCase();


    process.stdout.write(text);

}

function readLine() {
    var myInterface = readline.createInterface({
        input: fs.createReadStream('./resources/tests/dolphin.svg')
    });

    var lineno = 0;
    myInterface.on('line', function (line) {
        if(line.startsWith("<path")){
            console.log('Line number ' + lineno + ': ' + line);
        }
        lineno++;
    });
}
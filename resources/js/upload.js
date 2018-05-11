//https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
//https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/


let dropArea = document.getElementById('drop-area');['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});


// ************* Functions for Drag and Drop


function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
})

;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
})

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files)
}

function handleFiles(files) {
    files = [...files];
    files.forEach(uploadFile);
    files.forEach(previewFile);
}

function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function() {

        let img = document.createElement('img');
        img.src = reader.result;
        document.getElementById('gallery').appendChild(img);

        var fullFilename = file.name.split('.');
        var filename = fullFilename[0];
        img.id = filename;
        img.setAttribute("onclick", "openImgWithId(this.attributes['id'].value);");

    }
}

function uploadFile(file) {

    let url = 'http://localhost:8080/home';
    let formData = new FormData();

    formData.append('file', file);
    console.log("File is appended to FormData");

    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    })
        .then(() => {
            /* Done. Inform the user */
            console.log("File sent to server");
        })

        .catch(() => { /* Error. Inform the user */
            console.log("ERROR: File was not sent to sever");
        })
}



// Functions for selecting image to edit

// Function for image from user upload
function openImgWithId(id) {
    console.log("ID OF IMG IS: " + id);
    let img = document.createElement('img');
    img.setAttribute("src", "./resources/svg_display/" + id + ".svg");
    openImg(img);
}


// Function for images already in library
function openImg(imgs) {
    // Get the expanded image
    console.log("OPENING IMAGE");

    var expandImg = document.getElementById("expandedImg");
    // Get the image text
    var imgText = document.getElementById("imgtext");
    // Use the same src in the expanded image as the image being clicked on from the grid
    var imgid = imgs.id;
    console.log(imgid);

    expandImg.data = imgs.src;

    // Use the value of the alt attribute of the clickable image as text inside the expanded image
    imgText.innerHTML = imgs.alt;
    // Show the container element (hidden with CSS)
    expandImg.parentElement.style.display = "block";


    // **** Codeblock to access the inner elements of the SVG File

    // Access the object that contains the svg
    var a = document.getElementById("expandedImg");

    // It's important to add an load event listener to the object,
    // as it will load the svg doc asynchronously
    a.addEventListener("load",function(){

        // get the inner DOM of alpha.svg
        var svgDoc = a.contentDocument;

//        var paths = svgDoc.querySelectorAll('path');

        svgDoc.addEventListener("click", function(e){
            if(e.target && e.target.nodeName == "path") {
                // path item found!  Output the ID!
                console.log("Path item ", e.target.id, " was clicked!");
                e.target.setAttribute("fill", "blue");
            }
        });

     }, false);  // end aListener on object
}





//https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
//https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/


let dropArea = document.getElementById('drop-area');['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
})


// ************* Functions for Drag and Drop


function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
}

function handleFiles(files) {
    files = [...files]
    files.forEach(uploadFile)
    files.forEach(previewFile)
}

function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
        let img = document.createElement('img');
        img.src = reader.result;
        document.getElementById('gallery').appendChild(img);

        var fullFilename = file.name.split('.');
        var filename = fullFilename[0];
        img.id = filename;
    }
}

function uploadFile(file) {

    let url = 'http://localhost:8080/home';
    let formData = new FormData()

    formData.append('file', file)
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










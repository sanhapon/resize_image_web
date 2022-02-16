const   dropArea = document.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        button = dropArea.querySelector("button"),
        input = dropArea.querySelector("input"),
        imageResult = document.getElementById('image-result'),
        slider = document.getElementById("slider"),
        sliderImageInfo = document.getElementById("slider-img-info"),
        sliderValue = document.getElementById("slider-value"),
        downloadLink = document.getElementById("download_link"),
        fileSize = document.getElementById("file_size");


let file;

button.onclick = ()=>{
  input.click();
}

input.addEventListener("change", function(){
  file = this.files[0];
  dropArea.classList.add("active");
  showFile();
});

dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

dropArea.addEventListener("drop", (event)=>{
  event.preventDefault();
  file = event.dataTransfer.files[0];
  showFile();
});

slider.oninput = function() {
  sliderValue.textContent = `Quality: ${this.value}`;
  compress(global_fileAsArray, this.value);
}

//************************** */
function compress(imgAsArray, gQuality) {
  if (wasm_loaded == false) {
    return;
  }

  var len = imgAsArray.byteLength;
  var buf = Module._malloc(len);
  Module.HEAPU8.set(new Uint8Array(imgAsArray), buf);
  var size = Module._jpg_transcode(buf, len, gQuality);
  var result = new Uint8Array(Module.HEAPU8.buffer, buf, size);

  var blob = new Blob([result], {type: "image/jpeg"});
  var compressedUrl = URL.createObjectURL(blob);

  render_image(compressedUrl);
  setFileSize(size);
  setDownlaod(compressedUrl, file.name, gQuality);
  Module._free(buf);
}

function render_image(url) {
  var image = new Image();
  image.onload = function() {
    imageResult.style.display = "inline-block";
    imageResult.style.backgroundImage='url(\"'+image.src+'\")';
    imageResult.style.backgroundSize= 'cover';
    dropArea.style.display = 'none';
    // download_link.style.display = 'inline';
  };

  image.src = url;
}

function showFile(){
  let fileType = file.type;
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];

  if(validExtensions.includes(fileType)){
    let reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        global_fileAsArray = e.target.result;
        var blob = new Blob([global_fileAsArray], {type: "image/jpeg"});
        var url = URL.createObjectURL(blob);
        render_image(url);
        setDownlaod(url, file.name, 'origin');
        setFileSize(file.size);
      };
    })(file);

    reader.readAsArrayBuffer(file);
  }else{
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

function setDownlaod(url, filename, quality) {
  downloadLink.href = url;
  downloadLink.download = `${filename}-${quality}.jpeg`;
}

function setFileSize(size){
  fileSize.innerHTML = `(${(size / 1024.0).toFixed(2)} Kb.)`;
}
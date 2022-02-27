const   dropArea = document.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        button = dropArea.querySelector("button"),
        input = dropArea.querySelector("input"),
        imageResult = document.getElementById('image-result'),
        slider = document.getElementById("slider"),
        sliderImageInfo = document.getElementById("slider-img-info"),
        sliderValue = document.getElementById("slider-value"),
        downloadLink = document.getElementById("download_link"),
        fileSize = document.getElementById("file_size"),
        button_container = document.querySelector(".button_container"),
        plus_minus_container = document.querySelector(".plus_minus_container"),
        new_picture = document.getElementById("new_picture"),
        button_plus = document.getElementById("button_plus"),
        button_minus = document.getElementById("button_minus");


let file;
quality_value = 0;

new_picture.onclick = () => {
  location.reload();
}

slider.oninput = function() {
  compress(global_fileAsArray, this.value, false);
}

button_plus.onclick = () => {
  if (quality_value < 100) {
    quality_value += 5;
    compress(global_fileAsArray, quality_value, false);
  }
}

button_minus.onclick = () => {
  if (quality_value > 5) {
    quality_value -= 5;
    compress(global_fileAsArray, quality_value, false);
  }
}

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

//************************** */
function compress(imgAsArray, gQuality, onImageLoad) {
  if (wasm_loaded == false) {
    return;
  }

  sliderValue.textContent = `Quality:${gQuality}`;

  var len = imgAsArray.byteLength;
  var buf = Module._malloc(len);
  Module.HEAPU8.set(new Uint8Array(imgAsArray), buf);
  var size = Module._jpg_transcode(buf, len, gQuality);
  var result = new Uint8Array(Module.HEAPU8.buffer, buf, size);

  var blob = new Blob([result], {type: "image/jpeg"});
  var compressedUrl = URL.createObjectURL(blob);

  if (onImageLoad === false) {
    render_image(compressedUrl);
  }

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

    button_container.style.display = "block";

    quality_value = 80;
    slider.value = quality_value;
    compress(global_fileAsArray, quality_value, true);
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
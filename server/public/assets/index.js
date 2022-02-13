const   dropArea = document.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        button = dropArea.querySelector("button"),
        input = dropArea.querySelector("input"),
        slider = document.getElementById("slider"),
        sliderValue = document.getElementById("slider-value"),
        download_link = document.getElementById("download_link"),
        image_result = document.querySelector('.image-result');

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

  // sizekb.innerHTML = "" + (size / 1024.0).toFixed(2);
  Module._free(buf);

  /*** set download link ***/
  download_link.href = compressedUrl;
  download_link.download = `${(Math.random() + 1).toString(36).substring(7)}.jpeg`;
}

function render_image(url) {
  var image = new Image();
  image.onload = function() {
    image_result.style.width = "850px";
    image_result.style.height = "500px";
    image_result.style.backgroundImage='url(\"'+image.src+'\")';
    image_result.style.backgroundSize= 'cover';
    image_result.style.backgroundAttachment= 'scroll';
    dropArea.style.display = 'none';
    download_link.style.display = 'inline';
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
      };
    })(file);

    reader.readAsArrayBuffer(file);
  }else{
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

slider.oninput = function() {
  sliderValue.textContent = `Quality: ${this.value}`;
  // setTimeout(function() {}, 1000);
  compress(global_fileAsArray, this.value);
}

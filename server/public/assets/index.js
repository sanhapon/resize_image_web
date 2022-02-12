const   dropArea = document.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        button = dropArea.querySelector("button"),
        input = dropArea.querySelector("input"),
        slider = document.getElementById("slider"),
        sliderValue = document.getElementById("slider-value"),
        download_link = document.getElementById("download_link");

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

function set_size(img,el) {
  var width = img.width;
  var height = img.height;
  el.style.width = width+"px";
  el.style.height = height+"px";
  el.style.backgroundImage='url(\"'+img.src+'\")';
}


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

  var container = document.getElementById('result');

  var image = new Image();
  container.style.background="gray";
  container.style.backgroundImage="";
  image.onload = function() {
    set_size(image,container)
  };

  image.src = compressedUrl;

  // sizekb.innerHTML = "" + (size / 1024.0).toFixed(2);
  Module._free(buf);

  /*** set download link ***/
  download_link.href = compressedUrl;
  download_link.download = `${(Math.random() + 1).toString(36).substring(7)}.jpeg`;
}

function showFile(){
  let fileType = file.type;
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];

  if(validExtensions.includes(fileType)){
    let reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        global_fileAsArray = e.target.result;
      };
    })(file);

    reader.readAsArrayBuffer(file);
  }else{
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

sliderValue.textContent = `${slider.value}`;

slider.oninput = function() {
  sliderValue.textContent = `${this.value}`;
  sliderValue.style.marginLeft = `${this.value - 1}% `;

  setTimeout(function() {}, 1000);

  compress(global_fileAsArray, this.value);
}

//selecting all required elements
const   dropArea = document.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        button = dropArea.querySelector("button"),
        input = dropArea.querySelector("input"),
        slider = document.getElementById("slider"),
        sliderValue = document.getElementById("slider-value");

let file; //this is a global variable and we'll use it inside multiple functions

button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  showFile(); //calling function
});


//************************** */

function set_size(img,el) {
  var width = img.width;
  var height = img.height;
  el.style.width = width+"px";
  el.style.height = height+"px";
  el.style.backgroundImage='url(\"'+img.src+'\")';
  if(el==right){
      offset = {width: width, height: height};
      if(first){
          splitx = splitx_target = width*.5;
          splity = splity_target = height*.5;
          first=0;
      }
  }
}


function set_right_array(imgAsArray, gQuality) {
  if (wasm_loaded == false) {
    return;
  }

  var len = imgAsArray.byteLength;
  var buf = Module._malloc(len);
  Module.HEAPU8.set(new Uint8Array(imgAsArray), buf);
  var size = Module._jpg_transcode(buf, len, gQuality);
  console.log((size / 1024.0).toFixed(2));
  var result = new Uint8Array(Module.HEAPU8.buffer, buf, len);

  var blob = new Blob([result], {type: "image/jpeg"});
  var compressedUrl = URL.createObjectURL(blob);

  var container = document.getElementById('result');

  var image = new Image();
  container.style.background="gray";
  container.style.backgroundImage="";
  image.onload = function(){set_size(image,container)};
  image.src = compressedUrl;

  // sizekb.innerHTML = "" + (size / 1024.0).toFixed(2);
  Module._free(buf);
}

function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array

  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let reader = new FileReader(); //creating new FileReader object

    var gQuality=50;
    reader.onload = (function(theFile) {
      return function(e) {
        fileAsArray = e.target.result;
        set_right_array(fileAsArray, "&rarr;&nbsp;Q: " + gQuality);
      };
    })(file);

    reader.readAsArrayBuffer(file);
  }else{
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

sliderValue.textContent = `${slider.value - 50}%`; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  sliderValue.textContent = `${this.value - 50}%`;
  sliderValue.style.marginLeft = `${this.value}%`;
}

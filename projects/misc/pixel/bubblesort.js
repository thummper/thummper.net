var ind = 0;
var jstore = 0;

function imageUpload(files) {

    if (files == null || files == undefined) {
        document.write("Your browser does not support FileReader");
        return false;
    }

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;

        if (!file.type.match(imageType)) {
            continue;
        }

        var reader = new FileReader();
        if (reader != null) {
            reader.onload = setImage;
            reader.readAsDataURL(file);
        }
    }

};

function setImage(e) {
    var canvas = document.getElementById("imageCanvas");
    var img = new Image();
    img.onload = function () {


        console.log("Image loaded w:h :" + this.width + " : " + this.height);

        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(img, 0, 0, this.width, this.height);
        //Image data contains one long array with all of the pixels, stores RGBA of all pixels (4 items in array for each pixel)

        //Image is loaded into canvas at this point.


        //Search in intervals
        start():
            swapPixels(100);
    }
    img.src = e.target.result;



}

function start() {
    window.setInterval(function () {

        var canvas = document.getElementById("imageCanvas");
        var context = canvas.getContext("2d");
        context.putImageData(imageData, 0, 0);


    }, 1000);
}

function swapPixels(numSort) {
    console.log("SWAP");

    var canvas = document.getElementById("imageCanvas");
    var context = canvas.getContext("2d");
    window.imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imageData.data;
    //This function will sort x pixels with bubble sort. 

    //I want to to x comparisons each time, after x comparisons have been done store where we got to and end the loop.

    let counter = 0;
    for (let j = jstore; j < (pixels.length - ind - 1); j += 4) {
        console.log("JS" + jstore);

        let red = pixels[j];
        let green = pixels[j + 1];
        let blue = pixels[j + 2];
        let alpha = pixels[j + 3];
        let average = (red + blue + green) / 3;

        let red1 = pixels[j + 4];
        let green1 = pixels[j + 5];
        let blue1 = pixels[j + 6];
        let alpha1 = pixels[j + 7];
        let average1 = (red1 + blue1 + green1) / 3;

        if (average1 < average) {
            //Swap the pixels. 
            pixels[j] = red1;
            pixels[j + 1] = green1;
            pixels[j + 2] = blue1;
            pixels[j + 3] = alpha1;

            pixels[j + 4] = red;
            pixels[j + 5] = green;
            pixels[j + 6] = blue;
            pixels[j + 7] = alpha;
        }
        jstore += 4;
        if (jstore == pixels.length - ind - 1) {
            jstore = 0;
        }
        ind++;
        counter++;
        if (counter == numSort) {
            //Stop the loop

            break;
        }
        imageData.data = pixels;
    }




    if (ind < pixels.length) {
        swapPixels(100);
    }

}

function mergeSort() {
    var canvas = document.getElementById("imageCanvas");
    var context = canvas.getContext("2d");
    window.imageData = context.getImageData(0, 0, canvas.width, canvas.height);



}

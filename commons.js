let minConfidence = 0.5

const video = document.getElementById("inputVideo")

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: true },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

var width = 256, height = 256, buffer = new Uint8ClampedArray(width * height * 4);


var canvas1 = document.getElementById('canvas'),
  ctx = canvas1.getContext('2d');

canvas1.width = width;
canvas1.height = height;

const container = document.createElement('div')
container.style.position = 'relative'
document.body.append(container)

container.append(video)
video.addEventListener('play', () => {

  const canvas = faceapi.createCanvasFromMedia(video);
  container.append(canvas);

  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options());
    // image2 = await faceapi.nets.ssdMobilenetv1.getConvLayer();
    grayScale = await faceapi.nets.ssdMobilenetv1.getGrayScale();
    // console.log(image2);
    var idata = ctx.createImageData(width, height);
    idata.data.set(grayScale);
    ctx.putImageData(idata, 0, 0);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);

  }, 200)
})
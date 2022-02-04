const video = document.querySelector("#video");

Promise.all([
   faceapi.nets.tinyFaceDetector.loadFromUri("face-api/models"),
   faceapi.nets.faceLandmark68Net.loadFromUri("face-api/models"),
   faceapi.nets.faceRecognitionNet.loadFromUri("face-api/models"),
   faceapi.nets.faceExpressionNet.loadFromUri("face-api/models"),
   faceapi.nets.ageGenderNet.loadFromUri("face-api/models")
]).then( startVideo );

function startVideo(){
   if(navigator.mediaDevices.getUserMedia){
      navigator.mediaDevices.getUserMedia({
         video: true,
         audio: false
      })
       .then(data => video.srcObject = data)
       .catch(error => console.log(error))
   } else {
      return console.log("Not supported!");
   }
}

video.addEventListener("playing", () => {
   const canvas = faceapi.createCanvasFromMedia(video);
   document.body.append(canvas);

   const sizes = {
      width: video.width,
      height: video.height
   }

   faceapi.matchDimensions(canvas,sizes);

   setInterval( async () => {
      const detections = await faceapi
             .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
             .withFaceExpressions()


      const resizes = await faceapi.resizeResults(detections,sizes);

      canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);

      faceapi.draw.drawDetections(canvas,resizes);
      faceapi.draw.drawFaceExpressions(canvas,resizes);
   },100);
});
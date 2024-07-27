import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import './App.css'; // Import file CSS untuk styling

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [inputText, setInputText] = useState('Teks Akan Tampil Jika Kamera Aktif');
  const [model, setModel] = useState(null); // Default text for display
  const [isVideoReady, setIsVideoReady] =  useState(false);

  useEffect(() => {

    tf.setBackend('cpu'); //avoid CSP error
    // Mengecek apakah browser mendukung akses ke kamera
    const checkCameraSupport = async () => {  
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          setIsCameraAvailable(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              setIsVideoReady(true);
            }
          }
        }
      } catch (error) {
        console.error('Tidak dapat mengakses kamera:', error);
      }
    };

    checkCameraSupport();

    //load model 
    const loadModel= async() => {
      try {

        const model = await tf.loadGraphModel('http://127.0.0.1:8080/model.json');
        setModel(model);
        console.log("Model berhasil dimuat")

      } catch (error){
        console.error("Gagal memuat model", error)
      }
    };

    checkCameraSupport();
    loadModel();

    

    //model prediksi ditulis di teks

    const predict = async () => {

      if (model && videoRef.current && isVideoReady) {
        const video = videoRef.current;
        const canvas = canvasRef.current; 
        const ctx = canvas.getContext('2d');

        if (video.videoWidth > 0 && video.videoHeight > 0) {

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageTensor = tf.browser.fromPixels(canvas);

        console.log("Image tensor shape:" , imageTensor.shape);

        const resized = tf.image.resizeBilinear(imageTensor[680, 480]);
        const normalized =  resized.toFLoat().div(tf.scalar(255));
        const input = normalized.expandDims(0);


        const prediction = await model.predict(input).data();
        setInputText (`Prediksi: ${Array.from(prediction).join(', ')}`)

        } else {
          console.warn("Dimensi tidak valid")
        }
      }

    };

    const interval = setInterval(predict, 500);



    // Membersihkan penggunaan kamera saat komponen dilepas
    return () => {

      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, [model, isVideoReady]);

  return (
    <div className="camera-container">
      <img src="../img/logo[1].png" alt="Logo" className="logo" />
      {isCameraAvailable ? (
        <><video
          ref={videoRef}
          className="video-stream"
          autoPlay
        ></video><canvas ref={canvasRef} style={{ display: 'none' }}></canvas></>
      ) : (
        <p>Kamera tidak tersedia</p>
      )}
      <div className="text-input-container">
        <p className="display-text">{inputText}</p> {/* Menampilkan teks input */}
      </div>
    </div>
  );
};

export default App;

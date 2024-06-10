// export default App;
import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Import file CSS untuk styling

const App = () => {
  const videoRef = useRef(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);

  useEffect(() => {
    // Mengecek apakah browser mendukung akses ke kamera
    const checkCameraSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          setIsCameraAvailable(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error('Tidak dapat mengakses kamera:', error);
      }
    };

    checkCameraSupport();

    // Membersihkan penggunaan kamera saat komponen dilepas
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <div className="camera-container"> 
      {isCameraAvailable ? (
        <video
          ref={videoRef}
          className="video-stream"
          autoPlay
        ></video>
      ) : (
        <p>Kamera tidak tersedia</p>
      )}
    </div>
  );
};

export default App;
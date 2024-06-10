import React, { useState, useRef, useEffect } from 'react';

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
    <div>
      {isCameraAvailable ? (
        <video
          ref={videoRef}
          style={{ width: '100%', maxWidth: '500px', maxHeight: '500px' }}
          autoPlay
        ></video>
      ) : (
        <p>Kamera tidak tersedia</p>
      )}
    </div>
  );
};

export default App;

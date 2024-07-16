import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Import file CSS untuk styling

const App = () => {
  const videoRef = useRef(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [inputText, setInputText] = useState('Teks Akan Tampil Jika Kamera Aktif'); // Default text for display

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
      <img src="../img/logo[1].png" alt="Logo" className="logo" />
      {isCameraAvailable ? (
        <video
          ref={videoRef}
          className="video-stream"
          autoPlay
        ></video>
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

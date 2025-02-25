import React, { useRef, useState, useEffect } from 'react';
import jsQR from 'jsqr';

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrData, setQRData] = useState<string>('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Minta akses ke kamera dengan kamera belakang (facingMode: 'environment')
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true'); // agar iOS tidak fullscreen
        video.play();
        requestAnimationFrame(scan);
      })
      .catch((err) => {
        console.error('Error accessing camera: ', err);
      });

    // Hentikan stream kamera saat komponen unmount
    return () => {
      if (video && video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const scan = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      requestAnimationFrame(scan);
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      requestAnimationFrame(scan);
      return;
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Sesuaikan ukuran canvas dengan video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Gambar frame video ke canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Ambil data gambar dari canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      // Dekode QR code dari data gambar
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
      if (code) {
        setQRData(code.data);
      }
    }
    // Lanjutkan scanning pada frame berikutnya
    requestAnimationFrame(scan);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      {/* Canvas untuk memproses frame video, bisa disembunyikan */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {qrData && <p>Scanned QR Code: {qrData}</p>}
    </div>
  );
};

export default QRScanner;

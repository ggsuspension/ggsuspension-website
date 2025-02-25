// Buat file baru dengan nama App.jsx

import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [cameras, setCameras] = useState<any>([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Memeriksa kamera yang tersedia
    Html5Qrcode.getCameras()
      .then((devices: any) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Default pilih kamera belakang jika tersedia
          const backCamera = devices.find(
            (device: any) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("belakang")
          );
          if (backCamera) {
            setSelectedCameraId(backCamera.id);
          } else {
            setSelectedCameraId(devices[0].id);
          }
        } else {
          setError("Tidak ada kamera yang terdeteksi!");
        }
      })
      .catch((err: any) => {
        setError(`Error memuat kamera: ${err.message}`);
      });
  }, []);

  const startScanning = () => {
    if (!selectedCameraId) {
      setError("Silakan pilih kamera terlebih dahulu");
      return;
    }

    setScanning(true);
    setScanResult(null);
    setError("");

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode
      .start(
        selectedCameraId,
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText: any) => {
          setScanResult(decodedText);
          html5QrCode
            .stop()
            .then(() => {
              setScanning(false);
            })
            .catch((err: any) => {
              setError(`Error menghentikan kamera: ${err.message}`);
            });
        },
        (errorMessage: any) => {
          // Ini hanya untuk error pada fase scanning, bukan error fatal
          console.log(errorMessage);
        }
      )
      .catch((err: any) => {
        setScanning(false);
        setError(`Error memulai kamera: ${err.message}`);
      });
  };

  const handleCameraChange = (e: any) => {
    setSelectedCameraId(e.target.value);
  };

  const resetScanner = () => {
    setScanResult(null);
    setError("");
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">QR Code Scanner</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!scanning && !scanResult && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Pilih Kamera:</label>
            <select
              className="border rounded w-full py-2 px-3"
              onChange={handleCameraChange}
              value={selectedCameraId}
            >
              <option value="">Pilih kamera</option>
              {cameras.map((camera: any) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Kamera ${camera.id}`}
                </option>
              ))}
            </select>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={startScanning}
            disabled={!selectedCameraId}
          >
            Mulai Scan
          </button>
        </>
      )}

      {scanning && (
        <div className="mb-4">
          <div id="reader" className="w-full"></div>
          <p className="text-center mt-2">Scanning...</p>
        </div>
      )}

      {scanResult && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Hasil Scan:</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {scanResult}
          </div>

          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1"
              onClick={resetScanner}
            >
              Scan Lagi
            </button>
            <a
              href={
                scanResult.startsWith("http")
                  ? scanResult
                  : `https://${scanResult}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-1 text-center"
            >
              Buka Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;

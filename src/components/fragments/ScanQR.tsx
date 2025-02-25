import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Camera {
  id: string;
  label: string;
}

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    // Memeriksa kamera yang tersedia
    Html5Qrcode.getCameras()
      .then((devices: Camera[]) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Default pilih kamera belakang jika tersedia
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('belakang')
          );
          if (backCamera) {
            setSelectedCameraId(backCamera.id);
          } else {
            setSelectedCameraId(devices[0].id);
          }
        } else {
          setError('Tidak ada kamera yang terdeteksi!');
        }
      })
      .catch((err: Error) => {
        setError(`Error memuat kamera: ${err.message}`);
      });
      
    // Cleanup function
    return () => {
      stopPreview();
    };
  }, []);
  
  // Menghentikan preview kamera
  const stopPreview = (): void => {
    if (previewStreamRef.current) {
      previewStreamRef.current.getTracks().forEach(track => track.stop());
      previewStreamRef.current = null;
      setShowPreview(false);
    }
  };
  
  // Memulai preview kamera
  const startPreview = async (): Promise<void> => {
    if (!selectedCameraId) {
      setError('Silakan pilih kamera terlebih dahulu');
      return;
    }
    
    try {
      stopPreview(); // Hentikan preview sebelumnya jika ada
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedCameraId } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        previewStreamRef.current = stream;
        setShowPreview(true);
        setError('');
      }
    } catch (err) {
      setError(`Error memulai preview kamera: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setShowPreview(false);
    }
  };

  const startScanning = (): void => {
    if (!selectedCameraId) {
      setError('Silakan pilih kamera terlebih dahulu');
      return;
    }

    // Hentikan preview sebelum memulai scanning
    stopPreview();
    
    setScanning(true);
    setScanResult(null);
    setError('');

    const html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
      selectedCameraId,
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText: string) => {
        setScanResult(decodedText);
        html5QrCode.stop().then(() => {
          setScanning(false);
        }).catch((err: Error) => {
          setError(`Error menghentikan kamera: ${err.message}`);
        });
      },
      (errorMessage: string) => {
        // Ini hanya untuk error pada fase scanning, bukan error fatal
        console.log(errorMessage);
      }
    ).catch((err: Error) => {
      setScanning(false);
      setError(`Error memulai kamera: ${err.message}`);
    });
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCameraId(e.target.value);
    stopPreview(); // Hentikan preview saat kamera berubah
  };

  const resetScanner = (): void => {
    setScanResult(null);
    setError('');
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
              {cameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Kamera ${camera.id}`}
                </option>
              ))}
            </select>
          </div>
          
          {/* Preview kamera */}
          <div className="mb-4">
            {showPreview ? (
              <div className="relative">
                <video 
                  ref={videoRef} 
                  className="w-full rounded border" 
                  autoPlay 
                  playsInline
                ></video>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-dashed border-blue-500 w-48 h-48 rounded"></div>
                </div>
              </div>
            ) : (
              <button 
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mb-2"
                onClick={startPreview}
                disabled={!selectedCameraId}
              >
                Tampilkan Preview Kamera
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {showPreview && (
              <button 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-1"
                onClick={stopPreview}
              >
                Tutup Preview
              </button>
            )}
            
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1"
              onClick={startScanning}
              disabled={!selectedCameraId}
            >
              Mulai Scan
            </button>
          </div>
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
              href={scanResult.startsWith('http') ? scanResult : `https://${scanResult}`}
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
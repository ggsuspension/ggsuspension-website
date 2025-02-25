import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Camera {
  id: string;
  label: string;
}

const QRCodeScanner: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // Load available cameras when component mounts
  useEffect(() => {
    const loadCameras = async (): Promise<void> => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setCameras(devices);
          
          // Try to select back camera by default
          const backCamera = devices.find(
            camera => camera.label.toLowerCase().includes('back') || 
                      camera.label.toLowerCase().includes('belakang')
          );
          
          if (backCamera) {
            setSelectedCamera(backCamera.id);
          } else {
            setSelectedCamera(devices[0].id);
          }
        } else {
          setError('Tidak ada kamera yang terdeteksi');
        }
      } catch (err) {
        setError(`Error mengakses kamera: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Failed to get cameras', err);
      }
    };

    loadCameras();

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error('Failed to stop scanner', err);
        });
      }
    };
  }, []);

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCamera(e.target.value);
  };

  const startScanning = async (): Promise<void> => {
    if (!selectedCamera) {
      setError('Pilih kamera terlebih dahulu');
      return;
    }

    try {
      setError(null);
      setResult(null);
      setScanning(true);

      // Create scanner instance
      if (!scannerContainerRef.current) {
        throw new Error('Scanner container not found');
      }

      const scannerId = 'html5-qrcode-scanner';
      
      // Clear previous scanner element if exists
      let scannerElement = document.getElementById(scannerId);
      if (scannerElement) {
        scannerElement.innerHTML = '';
      } else {
        scannerElement = document.createElement('div');
        scannerElement.id = scannerId;
        scannerContainerRef.current.appendChild(scannerElement);
      }

      // Initialize scanner
      scannerRef.current = new Html5Qrcode(scannerId);

      // Configure and start scanner
      await scannerRef.current.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          // QR code detected
          setResult(decodedText);
          stopScanning();
        },
        (errorMessage: string) => {
          // Handle non-fatal errors (logs only, not stopping scan)
          console.log('QR scan error:', errorMessage);
        }
      );
    } catch (err) {
      setScanning(false);
      setError(`Error memulai scanner: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Failed to start scanner', err);
    }
  };

  const stopScanning = async (): Promise<void> => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Failed to stop scanner', err);
      }
    }
    setScanning(false);
  };

  const resetScanner = (): void => {
    setResult(null);
    setError(null);
  };

  // Handle QR code result - check if it's a URL
  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch (err) {
      return false;
    }
  };

  const getFormattedUrl = (text: string): string => {
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return text;
    }
    return `https://${text}`;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">QR Code Scanner</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {!scanning && !result && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Pilih Kamera:
          </label>
          <select
            value={selectedCamera}
            onChange={handleCameraChange}
            className="w-full p-2 border rounded mb-4 bg-white"
            disabled={cameras.length === 0}
          >
            <option value="" disabled>
              {cameras.length === 0 ? 'Tidak ada kamera' : 'Pilih kamera'}
            </option>
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Kamera ${camera.id}`}
              </option>
            ))}
          </select>

          <button
            onClick={startScanning}
            disabled={!selectedCamera}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Mulai Scan QR Code
          </button>
        </div>
      )}

      {scanning && (
        <div className="mb-6">
          <div 
            ref={scannerContainerRef} 
            className="w-full bg-gray-100 rounded overflow-hidden"
            style={{ minHeight: '300px' }}
          ></div>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={stopScanning}
              className="bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700"
            >
              Berhenti Scan
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <h2 className="text-lg font-medium mb-2">Hasil Scan:</h2>
          <p className="bg-white p-3 rounded border break-all mb-4">{result}</p>
          
          <div className="flex space-x-2">
            <button
              onClick={resetScanner}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700"
            >
              Scan Lagi
            </button>
            
            {isUrl(result) || result.includes('.') ? (
              <a
                href={isUrl(result) ? result : getFormattedUrl(result)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 text-center"
              >
                Buka Link
              </a>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
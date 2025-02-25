import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner: React.FC = () => {
  const [result, setResult] = useState<string>("");

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader
        // Menggunakan kamera belakang dengan opsi facingMode "environment"
        constraints={{ facingMode: "environment" }}
        // Fungsi callback yang menangani hasil scan
        onResult={(result: any, error: any) => {
          if (result) {
            setResult(result.getText());
          }
          if (error) {
            console.error(error);
          }
        }}
      />
      <p>Hasil Scan: {result}</p>
    </div>
  );
};

export default QRCodeScanner;

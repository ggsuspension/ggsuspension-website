import React, { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";
import FormPelanggan from "../pages/FormPelanggan";
import { Link, useParams } from "react-router-dom";
import { getCookie } from "@/utils/getCookie";
import { setDataPelanggan } from "@/firebase/service";
import { setCookie } from "@/utils/setCookie";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";
// import { QRCodeSVG } from "qrcode.react";

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrData, setQRData] = useState<any>("");
  const url = useParams().gerai;
  const getCookiePelanggan = getCookie("pelangganGGSuspension");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Minta akses ke kamera dengan kamera belakang (facingMode: 'environment')
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute("playsinline", "true"); // agar iOS tidak fullscreen
        video.play();
        requestAnimationFrame(scan);
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });

    // Hentikan stream kamera saat komponen unmount
    return () => {
      if (video && video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [qrData]);

  const scan = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      requestAnimationFrame(scan);
      return;
    }
    const context = canvas.getContext("2d");
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
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        if (url && getCookiePelanggan) {
          Swal.fire({
            title: "Berhasil Scan!",
            text: "Terimakasih sudah memakai pelayanan GG Suspension..",
            icon: "success",
          });
          let dataPelanggan = JSON.parse(getCookiePelanggan);
          dataPelanggan.status = true;
          setDataPelanggan(dataPelanggan).then(() => {
            const result = setCookie(
              "pelangganGGSuspension",
              JSON.stringify(dataPelanggan)
            );
            if (result.status) {
              window.location.reload();
            }
          });
        }
        setQRData(JSON.parse(code.data));
      }
    }
    requestAnimationFrame(scan);
  };

  return (
    <div>
      {!url &&
        qrData &&
        qrData.instansi == "ggsuspension" &&
        qrData.password == "GGsuspension123" && <FormPelanggan />}
      {/* <QRCodeSVG // Mengubah komponen QRCode menjadi QRCodeSVG
                  value={JSON.stringify({
                    instansi: "ggsuspension",
                    password:"GGsuspension123"
                  })}
                  size={400}
                  level="H"
                  includeMargin={true}
                /> */}
      {!qrData && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500 p-4">
          <div className="absolute top-4 left-4 z-10">
            <Link
              to="/"
              className="flex items-center gap-2 text-white hover:text-black"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Kembali</span>
            </Link>
          </div>

          <div className="">
            <h1 className="text-black text-4xl font-bold mb-6">Scan QR Code</h1>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <p className="text-gray-700 text-center mb-4">
                Silahkan arahkan QR code ke dalam bingkai di bawah
              </p>
              <div className="relative border-4 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {/* Video Preview */}
                <video
                  ref={videoRef}
                  style={{ width: "100%", height: "auto" }}
                />
                {/* Canvas untuk memproses frame video, bisa disembunyikan */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                {/* Overlay untuk area scanning */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border border-dashed border-gray-500 rounded-lg p-2 bg-white bg-opacity-70">
                    <p className="text-gray-500 text-sm">Area Scan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;

import axios from "axios";
export default function Nusantara() {
  // Fungsi untuk mendapatkan daftar provinsi
  async function getData() {
    try {
      const response = await axios.get("http://localhost:3000/api/provinces");

      console.log("Daftar Provinsi:", response.data);
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }
  // Contoh penggunaan
  getData();

  return <></>;
}

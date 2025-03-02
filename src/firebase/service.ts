import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "./init";

function getFormattedDate(date: Date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}
const today = new Date();

export async function getDataLayananSemuaCabang() {
  const res = await getDocs(
    collection(firestore, `data-layanan-${getFormattedDate(today)}`)
  );
  const result = res.docs.map((doc) => {
    return {
      id: doc.id,
      data: { ...doc.data().data, status: doc.data().status },
      gerai: doc.data().gerai,
      status: doc.data().status,
    };
  });
  return result;
}

export async function setDataPelanggan(data: any) {
  await setDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, data.id),
    {
      data: {
        nama: data.nama || data.data.nama,
        layanan: data.layanan || data.data.layanan||"",
        motor: data.motor || data.data.motor,
        bagianMotor: data.bagianMotor || data.data.bagianMotor,
        jenisMotor: data.jenisMotor || data.data.jenisMotor,
        hargaLayanan: data.hargaLayanan || data.data.hargaLayanan,
        hargaSeal: data.hargaSeal || data.data.hargaSeal,
        totalHarga: data.totalHarga || data.data.totalHarga,
        noWA: data.noWA || data.data.noWA,
        seal: data.seal || data.data.seal,
      },
      gerai: data.gerai,
      status: data.status || false,
      id: data.id,
    }
  );
  const result = await getDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, data.id)
  );
  return result.data();
}

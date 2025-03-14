import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./init";

function getFormattedDate(date: Date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}
const today = new Date();

export async function getDataLayananSemuaCabang(date:any) {
  date=date??getFormattedDate(today);
  const res = await getDocs(
    collection(firestore, `data-layanan-${date}`)
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

const waktu=Date.now();
export async function setDataPelanggan(data: any) {
  await setDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, data.id),
    {
      data: {
        nama: data.nama || data.data.nama,
        layanan: data.layanan || data.data.layanan||"",
        motor: data.motor || data.data.motor,
        bagianMotor: data.bagianMotor || data.data.bagianMotor,
        bagianMotor2: data.bagianMotor2 || data.data.bagianMotor2,
        jenisMotor: data.jenisMotor || data.data.jenisMotor,
        hargaLayanan: data.hargaLayanan || data.data.hargaLayanan,
        hargaSeal: data.hargaSeal || data.data.hargaSeal,
        totalHarga: data.totalHarga || data.data.totalHarga,
        noWA: data.noWA || data.data.noWA,
        info: data.info || data.data.info,
        seal: data.seal || data.data.seal,waktu,plat: data.plat || data.data.plat,sumber_info: data.sumber_info || data.data.sumber_info
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

export async function setFinishNow(data:any){
  await updateDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, data.id),{status:true})
    window.location.reload();
}

export async function setCancelNow(id:any){
  await deleteDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, id)
  )
    window.location.reload();
}
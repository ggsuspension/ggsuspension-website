import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./init";

// Fungsi untuk mengubah objek Date menjadi string dalam format "dd-mm-yy"
function getFormattedDate(date: Date): string {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2); // Ambil dua digit terakhir tahun
  return `${day}-${month}-${year}`;
}

// Fungsi untuk menghasilkan daftar tanggal (dalam string) dari start sampai end (inklusif)
function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(getFormattedDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

const today = new Date();
const waktu = Date.now();

export async function getDataLayananSemuaCabang(date: any) {
  date = date ?? getFormattedDate(today);
  const res = await getDocs(collection(firestore, `data-layanan-${date}`));
  const result = res.docs.map((doc) => ({
    id: doc.id,
    data: { ...doc.data().data, status: doc.data().status },
    gerai: doc.data().gerai,
    status: doc.data().status,
  }));
  return result;
}

export async function setDataPelanggan(data: any) {
  await setDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, data.id),
    {
      data: {
        nama: data.nama || data.data?.nama,
        layanan: data.layanan || data.data?.layanan || "",
        motor: data.motor || data.data?.motor,
        bagianMotor: data.bagianMotor || data.data?.bagianMotor,
        bagianMotor2: data.bagianMotor2 || data.data?.bagianMotor2,
        jenisMotor: data.jenisMotor || data.data?.jenisMotor,
        hargaLayanan: data.hargaLayanan || data.data?.hargaLayanan,
        hargaSeal: data.hargaSeal || data.data?.hargaSeal,
        totalHarga: data.totalHarga || data.data?.totalHarga,
        noWA: data.noWA || data.data?.noWA,
        info: data.info || data.data?.info,
        seal: data.seal || data.data?.seal,
        waktu,
        plat: data.plat || data.data?.plat,
        sumber_info: data.sumber_info || data.data?.sumber_info,
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

export async function updateDataPelanggan(data: any) {
  await updateDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, data.id),
    {
      data: {
        nama: data.nama || data.data?.nama,
        layanan: data.layanan || data.data?.layanan || "",
        motor: data.motor || data.data?.motor,
        bagianMotor: data.bagianMotor || data.data?.bagianMotor,
        bagianMotor2: data.bagianMotor2 || data.data?.bagianMotor2,
        jenisMotor: data.jenisMotor || data.data?.jenisMotor,
        hargaLayanan: data.hargaLayanan || data.data?.hargaLayanan,
        hargaSeal: data.hargaSeal || data.data?.hargaSeal,
        totalHarga: data.totalHarga || data.data?.totalHarga,
        noWA: data.noWA || data.data?.noWA,
        info: data.info || data.data?.info,
        seal: data.seal || data.data?.seal,
        waktu,
        plat: data.plat || data.data?.plat,
        sumber_info: data.sumber_info || data.data?.sumber_info,
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

export async function setFinishNow(data: any) {
  await updateDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, data.id),
    { status: true }
  );
  window.location.reload();
}

export async function setCancelNow(id: any) {
  await deleteDoc(
    doc(firestore, `data-layanan-${getFormattedDate(today)}`, id)
  );
  window.location.reload();
}

export async function getDocsFromDateRange(
  start: Date = new Date(2025, 2, 4),
  end: Date = new Date()
): Promise<any[]> {
  const dates = getDatesInRange(start, end);
  const allDocs: any[] = [];

  for (const date of dates) {
    const collectionName = `data-layanan-${date}`;
    const colRef = collection(firestore, collectionName);
    try {
      const querySnapshot = await getDocs(colRef);
      querySnapshot.forEach((doc) => {
        allDocs.push({
          collection: collectionName,
          id: doc.id,
          data: doc.data(),
        });
      });
    } catch (error) {
      console.error(`Error fetching collection ${collectionName}:`, error);
    }
  }
  return allDocs;
}

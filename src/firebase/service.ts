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

export async function getGeraiStatistics(start: Date, end: Date) {
  const data = await getDocsFromDateRange(start, end);
  const geraiMap: Record<
    string,
    {
      today: number;
      previousDay: number;
      weekly: Record<string, number>;
      monthly: Record<string, number>;
      yearly: Record<string, number>;
      totalPendapatan: number;
    }
  > = {};

  const todayStr = getFormattedDate(end);
  const yesterdayStr = getFormattedDate(new Date(end.getTime() - 86400000));

  data.forEach(({ data, collection }) => {
    const gerai = data.gerai || "unknown";
    const totalHarga = Number(data.data?.totalHarga) || 0;
    const dateStr = collection.replace("data-layanan-", "");
    const monthStr = dateStr.slice(3); // Ambil "mm-yy" untuk bulan
    const yearStr = `20${dateStr.slice(6)}`; // Ambil "yyyy" untuk tahun

    if (!geraiMap[gerai]) {
      geraiMap[gerai] = {
        today: 0,
        previousDay: 0,
        weekly: {},
        monthly: {},
        yearly: {},
        totalPendapatan: 0,
      };
    }

    // Hitung pendapatan hari ini dan kemarin
    if (dateStr === todayStr) {
      geraiMap[gerai].today += totalHarga;
    } else if (dateStr === yesterdayStr) {
      geraiMap[gerai].previousDay += totalHarga;
    }

    // Pendapatan mingguan
    geraiMap[gerai].weekly[dateStr] =
      (geraiMap[gerai].weekly[dateStr] || 0) + totalHarga;

    // Pendapatan bulanan
    geraiMap[gerai].monthly[monthStr] =
      (geraiMap[gerai].monthly[monthStr] || 0) + totalHarga;

    // Pendapatan tahunan
    geraiMap[gerai].yearly[yearStr] =
      (geraiMap[gerai].yearly[yearStr] || 0) + totalHarga;

    // Total pendapatan per gerai
    geraiMap[gerai].totalPendapatan += totalHarga;
  });

  return Object.keys(geraiMap).map((gerai) => {
    const { today, previousDay, weekly, monthly, yearly, totalPendapatan } =
      geraiMap[gerai];
    const change = previousDay
      ? ((today - previousDay) / previousDay) * 100
      : 0;

    return {
      name: gerai,
      today,
      change: parseFloat(change.toFixed(2)),
      totalPendapatan,
      monthly: Object.entries(monthly)
        .sort(
          ([a], [b]) =>
            Date.parse(`20${a.split("-")[1]}-${a.split("-")[0]}-01`) -
            Date.parse(`20${b.split("-")[1]}-${b.split("-")[0]}-01`)
        )
        .map(([key, value]) => ({ month: key, total: value })),
      weekly: Object.entries(weekly)
        .sort(
          ([a], [b]) =>
            Date.parse(`20${a.split("-")[1]}-${a.split("-")[0]}-01`) -
            Date.parse(`20${b.split("-")[1]}-${b.split("-")[0]}-01`)
        )
        .map(([key, value]) => ({ date: key, total: value })),
      yearly: Object.entries(yearly)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([key, value]) => ({ year: key, total: value })),
    };
  });
}

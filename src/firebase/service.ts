import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "./init";

export async function getDataLayananSemuaCabang() {
  const res = await getDocs(collection(firestore, "data-layanan"));
  const result = res.docs.map((doc) => {
    return { id: doc.id, data: doc.data().data, gerai: doc.data().gerai, status: doc.data().status };
  });
  return result;
}

export async function setDataPelanggan(data: any) {
  await setDoc(doc(firestore, "data-layanan", data.id), {
    data: {nama:data.nama||data.data.nama,layanan:data.layanan||data.data.layanan,motor:data.motor||data.data.motor},
    gerai: data.gerai,
    status: data.status||false,
    id: data.id,
  });
  const result = await getDoc(doc(firestore, "data-layanan", data.id));
  return result.data();
}

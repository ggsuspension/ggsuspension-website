import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "./init";

export async function getDataLayananSemuaCabang() {
  const res = await getDocs(collection(firestore, "data-layanan"));
  const result = res.docs.map((doc) => {
    return { id: doc.id, data:doc.data().data, gerai: doc.data().gerai };
  });
  return result;
}

export async function setDataPelanggan(data: any) {
  await addDoc(collection(firestore, "data-layanan"), {
    data,
    gerai: data.gerai,
  });
  return { msg: "berhasil" };
}

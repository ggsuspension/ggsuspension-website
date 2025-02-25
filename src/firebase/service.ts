import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./init";

export async function getDataLayananSemuaCabang() {
  const res = await getDocs(collection(firestore, "data-layanan"));
  const result = res.docs.map((doc) => doc.data());
  return result;
}

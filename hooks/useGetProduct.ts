import { FirebaseError } from "firebase/app";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../fb";
import { ProductType } from "../types";

const getProduct = async (id: string) => {
  if (!id) return;

  const docRef = doc(db, "products", id);

  const docSnap = await getDoc(docRef);

  const result = docSnap.data() as ProductType;

  await sleep(300).then(() => {
    console.log("delay");
  });

  return result;
};

function sleep(ms: number) {
  return new Promise((f) => setTimeout(f, ms));
}

const useGetProduct = (id: string) => {
  const query = useQuery<any, FirebaseError, ProductType>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetProduct;

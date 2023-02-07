import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { ProductType } from "../types";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../fb";

/**
 * 제품 상세 페이지와 북마크 제품 불러오기에 사용됨.
 * @param productId - 단일 string 혹은 string[]
 * @returns 단일 ProductType 혹은 ProductType[]
 */
function useGetProductsById<T extends string | Array<string>>(productId: T) {
  type returnType = T extends string ? ProductType : Array<ProductType>;

  const query = useQuery<any, FirebaseError, returnType>(
    ["products", productId],
    () => getProductsById(productId),
    { refetchOnWindowFocus: false }
  );

  return query;
}

export default useGetProductsById;

function sleep(ms: number) {
  return new Promise((f) => setTimeout(f, ms));
}

const getProductsById = async (id: Array<string> | string) => {
  if (!id || id.length === 0) return;

  switch (typeof id) {
    case "object":
      const q = query(collection(db, "products"), where("id", "in", id));
      const products: Array<ProductType> = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const product = doc.data() as ProductType;
        products.push(product);
      });

      await sleep(300).then(() => {
        console.log("delay");
      });

      return products;

    case "string":
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      const result = docSnap.data() as ProductType;
      await sleep(300).then(() => {
        console.log("delay");
      });
      return result;

    default:
      break;
  }
};

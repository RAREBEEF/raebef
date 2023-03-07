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
 * 해당하는 id 혹은 ids의 제품 데이터를 불러온다.
 * 제품 상세 페이지와 북마크 제품 불러오기에 사용.
 * @param productId - string || string[]
 * @param enable - boolean
 * @returns query
 */
function useGetProductsById<T extends string | Array<string>>(
  productId: T,
  enable: boolean = true
) {
  type returnType = T extends string ? ProductType : Array<ProductType>;

  const query = useQuery<any, FirebaseError, returnType>(
    ["productsById", productId],
    () => getProductsById(productId),
    {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 300000,
      staleTime: 300000,
      enabled: enable,
    }
  );

  return query;
}

export default useGetProductsById;

function sleep(ms: number) {
  return new Promise((f) => setTimeout(f, ms));
}

const getProductsById = async (id: Array<string> | string) => {
  if (!id || id.length === 0) return null;

  // id 복수 여부에 따라 분기
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

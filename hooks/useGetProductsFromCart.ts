import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fb";
import { ProductListType, ProductType } from "../types";

/**
 * idList에 포함된 제품 데이터 불러오기
 * {productId: ProductType} 구조로 제품 데이터 반환
 * @param idList string[]
 * @returns query
 */
const useGetProductsFromCart = (idList: Array<string> | null) => {
  const query = useQuery<any, FirebaseError, ProductListType>({
    queryKey: ["productsFromCart", idList],
    queryFn: () => getProductsFromCart(idList),
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
  });

  return query;
};

export default useGetProductsFromCart;

const getProductsFromCart = async (idList: Array<string> | null) => {
  if (!idList || idList.length === 0) return null;
  const products: ProductListType = {};

  const q = query(collection(db, "products"), where("id", "in", idList));

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    products[doc.id] = doc.data() as ProductType;
  });

  idList.forEach((id) => {
    if (!products.hasOwnProperty(id)) products[id] = null;
  });

  return products;
};

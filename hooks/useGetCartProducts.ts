import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fb";
import { ProductListType, ProductType } from "../types";

const getCartProducts = async (idList: Array<string> | null) => {
  if (!idList || idList.length === 0) return null;

  const products: ProductListType = {};

  const q = query(collection(db, "products"), where("id", "in", idList));

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    products[doc.id] = doc.data() as ProductType;
  });

  return products;
};
const useGetCartProducts = (
  idList: Array<string> | null,
  options?: { alwaysRefetch?: boolean }
) => {
  const query = useQuery<any, FirebaseError, ProductListType>({
    queryKey: ["products", idList],
    queryFn: () => getCartProducts(idList),
    refetchOnWindowFocus: options?.alwaysRefetch || false,
    refetchOnMount: options?.alwaysRefetch || false,
    refetchOnReconnect: options?.alwaysRefetch || false,
  });

  return query;
};

export default useGetCartProducts;

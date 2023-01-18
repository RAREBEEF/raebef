import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { ProductType } from "../types";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../fb";

const getCollectionProducts = async (idList: Array<string>) => {
  if (idList?.length === 0) return;

  const q = query(collection(db, "products"), where("id", "in", idList));
  const products: Array<ProductType> = [];
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const product = doc.data() as ProductType;
    products.push(product);
  });

  return products;
};

const useGetCollectionProducts = (productIdList: Array<string>) => {
  const query = useQuery<any, FirebaseError, Array<ProductType>>(
    ["collectionProducts", productIdList],
    () => getCollectionProducts(productIdList),
    { refetchOnWindowFocus: false }
  );

  return query;
};

export default useGetCollectionProducts;

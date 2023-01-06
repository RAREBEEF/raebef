import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import getCollectionProducts from "../pages/api/getCollectionProducts";
import { ProductType } from "../types";

const useGetCollectionProducts = (productIdList: Array<string>) => {
  const query = useQuery<any, FirebaseError, Array<ProductType>>(
    ["collectionProducts", productIdList],
    () => getCollectionProducts(productIdList),
    { refetchOnWindowFocus: false }
  );

  return query;
};

export default useGetCollectionProducts;

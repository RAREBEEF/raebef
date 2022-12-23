import { FirebaseError } from "firebase/app";
import { useEffect } from "react";
import { useQuery } from "react-query";
import getCollectionProducts from "../pages/api/getCollectionProducts";
import { ProductType } from "../types";

const useGetCollectionProducts = (
  productIdList: Array<string>,
  errorHandler: Function
) => {
  const query = useQuery<any, FirebaseError, Array<ProductType>>(
    ["collectionProducts", productIdList],
    () => getCollectionProducts(productIdList)
  );

  useEffect(() => {
    if (query.isError) errorHandler();
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetCollectionProducts;

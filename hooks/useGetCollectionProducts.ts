import { useEffect } from "react";
import { useQuery } from "react-query";
import getCollectionProducts from "../pages/api/getCollectionProducts";
import getCollections from "../pages/api/getCollections";

const useGetCollectionProducts = (
  productIdList: Array<string>,
  errorHandler: Function
) => {
  const query = useQuery(["collectionProducts", productIdList], () =>
    getCollectionProducts(productIdList)
  );

  useEffect(() => {
    if (query.isError) errorHandler();
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetCollectionProducts;

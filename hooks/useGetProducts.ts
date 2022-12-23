import { FirebaseError } from "firebase/app";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import getProducts from "../pages/api/getProducts";
import { FilterType, ProductType } from "../types";

const useGetProducts = (filter: FilterType, errorHandler: Function) => {
  const query = useInfiniteQuery<any, FirebaseError>({
    queryKey: ["products", filter],
    queryFn: ({ pageParam }) => getProducts(filter, pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.lastVisible,
    retry: false,
  });

  useEffect(() => {
    if (query.isError) errorHandler(query);
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetProducts;

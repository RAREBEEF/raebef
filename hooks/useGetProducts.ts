import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import getProducts from "../pages/api/getProducts";
import { FilterType } from "../types";

const useGetProducts = (filter: FilterType, errorHandler: Function) => {
  const [isStale, setIsStale] = useState<boolean>(false);
  const query = useInfiniteQuery<any, FirebaseError>({
    queryKey: ["products", filter],
    queryFn: ({ pageParam }) => getProducts(filter, pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.lastVisible,
    retry: false,
    enabled: isStale,
  });

  useEffect(() => {
    setIsStale(query.isStale);
  }, [query.isStale]);

  useEffect(() => {
    if (query.isError) errorHandler(query);
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetProducts;

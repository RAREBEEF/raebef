import { useEffect } from "react";
import { useQuery } from "react-query";
import getProductsCount from "../pages/api/getProductsCount";
import { FilterType } from "../types";

const useGetProductsCount = (filter: FilterType, errorHandler: Function) => {
  const query = useQuery(
    ["totalCount", filter],
    () => getProductsCount(filter),
    {
      retry: false,
    }
  );

  useEffect(() => {
    if (query.isError) errorHandler(query);
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetProductsCount;

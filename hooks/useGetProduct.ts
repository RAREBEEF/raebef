import { FirebaseError } from "firebase/app";
import { useEffect } from "react";
import { useQuery } from "react-query";
import getProduct from "../pages/api/getProduct";
import { ProductType } from "../types";

const useGetProduct = (id: string | undefined, errorHandler: Function) => {
  const query = useQuery<any, FirebaseError, ProductType>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    retry: false,
  });

  useEffect(() => {
    if (query.isError) errorHandler(query);
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetProduct;

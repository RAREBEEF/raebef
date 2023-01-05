import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import addProduct from "../pages/api/addProducts";

const useAddProduct = (errorHandler: Function, onSuccess: Function) => {
  const queryClient = useQueryClient();
  const mutation = useMutation("products", addProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      onSuccess();
    },
    retry: false,
  });

  useEffect(() => {
    if (mutation.isError) errorHandler();
  }, [errorHandler, mutation.isError]);

  return mutation;
};

export default useAddProduct;

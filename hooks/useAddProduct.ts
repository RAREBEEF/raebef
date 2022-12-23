import { useEffect } from "react";
import { useMutation } from "react-query";
import addProduct from "../pages/api/addProducts";

const useAddProduct = (errorHandler: Function, onSuccess: Function) => {
  const mutation = useMutation(addProduct, {
    onSuccess: () => onSuccess(),
  });

  useEffect(() => {
    if (mutation.isError) errorHandler();
  }, [errorHandler, mutation.isError]);

  return mutation;
};

export default useAddProduct;

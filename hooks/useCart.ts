import { useQueryClient, useMutation } from "react-query";
import addCartItem from "../pages/api/addCartItem";
import removeCartItem from "../pages/api/removeCartItem";

const useCart = (errorHandler: Function) => {
  const queryClient = useQueryClient();

  const add = useMutation("user", addCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    onError: () => errorHandler(),
  });

  const remove = useMutation("user", removeCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    onError: () => errorHandler(),
  });

  return { add, remove };
};

export default useCart;

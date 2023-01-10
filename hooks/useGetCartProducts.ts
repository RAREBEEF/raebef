import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import getCartProducts from "../pages/api/getCartProducts";
import { ProductListType } from "../types";

const useGetCartProducts = (idList: Array<string> | null) => {
  const query = useQuery<any, FirebaseError, ProductListType>({
    queryKey: ["products", idList],
    queryFn: () => getCartProducts(idList),
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetCartProducts;

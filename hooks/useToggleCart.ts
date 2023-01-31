import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { StockType } from "../types";
import useCart from "./useCart";
import useGetUserData from "./useGetUserData";

const useToggleCart = (productId: string) => {
  const router = useRouter();
  const { data: userData } = useGetUserData();
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const { add: addCart, remove: removeCart } = useCart();

  const toggleCart = (options: StockType) => {
    if (!userData?.user?.uid) {
      router.push({
        pathname: "/login",
        query: { from: `/products/${productId}` },
      });
    } else if (Object.keys(options).length === 0) {
      window.alert("구매하실 옵션을 추가해 주세요.");
    } else {
      addCart.mutate({
        uid: userData?.user?.uid,
        productId: productId,
        options,
      });
    }
  };

  const deleteCart = () => {
    if (!userData?.user?.uid) {
      router.push({
        pathname: "/login",
        query: { from: `/products/${productId}` },
      });
    } else if (isInCart) {
      removeCart.mutate({
        uid: userData?.user?.uid,
        productId: productId,
      });
    }
  };

  useEffect(() => {
    if (userData?.cart?.hasOwnProperty(productId)) {
      setIsInCart(true);
    } else {
      setIsInCart(false);
    }
  }, [productId, userData?.cart]);

  return { toggleCart, deleteCart, isInCart };
};

export default useToggleCart;

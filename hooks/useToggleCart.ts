import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { StockType } from "../types";
import useCart from "./useCart";
import useGetUserData from "./useGetUserData";

const useToggleCart = (productId: string) => {
  const router = useRouter();
  const { data: userData } = useGetUserData();
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const cartErrorHandler = () => {
    window.alert(
      "카트 추가/제거 중 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
    );
  };

  const { add: addCart, remove: removeCart } = useCart(cartErrorHandler);

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

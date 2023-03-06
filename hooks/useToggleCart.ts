import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { StockType } from "../types";
import useCart from "./useCart";
import useGetUserData from "./useGetUserData";

/**
 * 카트 아이템 추가 제거 및 카트 포함 여부 등 해당 제품에 대한 카트 기능 전반을 담당
 * @param productId 북마크를 제어할 대상 제품 id
 * @returns addCart, deleteCart, isInCart
 * */
const useToggleCart = (productId: string) => {
  const router = useRouter();
  const { data: userData } = useGetUserData();
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const { add, remove } = useCart();

  // 카트에 제품을 추가한다.
  const addCart = (options: StockType) => {
    if (!userData?.user?.uid) {
      router.push({
        pathname: "/login",
        query: { from: `/products/${productId}` },
      });
    } else if (Object.keys(options).length === 0) {
      window.alert("구매하실 옵션을 추가해 주세요.");
    } else {
      add.mutate({
        uid: userData?.user?.uid,
        productId: productId,
        options,
      });
    }
  };

  // 카트에서 아이템을 제거한다.
  const deleteCart = () => {
    if (!userData?.user?.uid) {
      router.push({
        pathname: "/login",
        query: { from: `/products/${productId}` },
      });
    } else if (isInCart) {
      remove.mutate({
        uid: userData?.user?.uid,
        productId: productId,
      });
    }
  };

  // 카트 포함 여부를 업데이트한다.
  useEffect(() => {
    if (userData?.cart?.hasOwnProperty(productId)) {
      setIsInCart(true);
    } else {
      setIsInCart(false);
    }
  }, [productId, userData?.cart]);

  return { addCart, deleteCart, isInCart };
};

export default useToggleCart;

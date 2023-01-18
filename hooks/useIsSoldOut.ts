import { useEffect, useState } from "react";
import { ProductType } from "../types";

/**
 * 제품의 모든 옵션이 품절 상태인지 체크
 * @param product
 * @returns
 */
const useIsSoldOut = (product: ProductType | null) => {
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);

  useEffect(() => {
    if (!product?.stock) return;

    const { stock } = product;

    if (Object.values(stock).some((stock) => stock >= 1)) {
      setIsSoldOut(false);
    } else {
      setIsSoldOut(true);
    }
  }, [product]);

  return isSoldOut;
};

export default useIsSoldOut;

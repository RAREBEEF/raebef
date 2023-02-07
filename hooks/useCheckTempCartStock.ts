import { ProductType, SizeType, TempCartType } from "../types";

/**
 * 임시 카트의 제품 중 품절인 옵션이 있는지 체크, 단일 제품을 대상으로 한다.
 * @param product
 * @param tempCart
 * @returns 재고 없을 경우 `false` 반환
 */
const useCheckTempCartStock = () => {
  const checkTempCartStock = (product: ProductType, tempCart: TempCartType) => {
    const isSoldOut: Array<boolean> = [];

    if (!product || !tempCart) return;

    Object.entries(tempCart).forEach((el) => {
      const [size, count] = el as [SizeType, number];

      isSoldOut.push((product.stock[size] as number) < count);
    });

    return !isSoldOut.some((isSoldOut) => isSoldOut);
  };

  return checkTempCartStock;
};

export default useCheckTempCartStock;

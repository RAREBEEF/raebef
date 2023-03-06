import { ProductType, SizeType, TempCartType } from "../types";

/**
 * 제품의 임시 카트에 품절인 옵션이 있는지 체크
 * @returns checkTempCartStock
 */
const useCheckTempCartStock = () => {
  /**
   * 제품의 임시 카트에 품절인 옵션이 있는지 체크
   * @param product
   * @param tempCart
   * @returns 품절이 존재하면 `false`
   */
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

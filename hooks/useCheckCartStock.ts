import { CartType, ProductListType, SizeType } from "../types";

/**
 * 카트의 제품 중 품절인 옵션이 있는지 체크, 복수의 제품을 대상으로 한다.
 * @returns checkCartStock
 * */
const useCheckCartStock = () => {
  /**
   * 카트의 제품 중 품절인 옵션이 있는지 체크, 복수의 제품을 대상으로 한다.
   * @param productsData
   * @param cart
   * @returns 품절이 존재하면 `false`
   */
  const checkCartStock = (productsData: ProductListType, cart: CartType) => {
    const isSoldOut: Array<boolean> = [];

    if (!productsData || !cart) return;

    Object.entries(productsData).forEach((el) => {
      const [id, product] = el;

      if (!cart[id]) return;

      const sizes = Object.entries(cart[id]);

      sizes.forEach((el) => {
        const [size, orderCount] = el as [SizeType, number];
        isSoldOut.push((product?.stock[size] as number) < orderCount);
      });
    });

    return !isSoldOut.some((isSoldOut) => isSoldOut);
  };

  return checkCartStock;
};

export default useCheckCartStock;

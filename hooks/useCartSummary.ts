import {
  CartSummaryData,
  CartType,
  ProductListType,
  SizeType,
  UserData,
} from "../types";

/**
 * 품절 여부, 주문 수, 제품 수, 총 금액 계산
 * @param userData - 유저 데이터
 * @param cart - 카트 데이터
 * @param productsData - 제품 데이터
 */
const useCartSummary = (
  userData: UserData | null,
  cart: CartType | null,
  productsData: ProductListType | null
): CartSummaryData | null => {
  if (!userData || !productsData || !cart) return null;

  const calcCart = (cart: CartType, productsData: ProductListType) => {
    const isOutOfStock: Array<boolean> = [];

    const calc = Object.entries(cart).reduce(
      (acc, cur) => {
        const [productId, options] = cur;
        let orderCount = 0;

        Object.entries(options).forEach((el) => {
          const [size, count] = el as [SizeType, number];

          orderCount += count;

          if (!productsData[productId].stock[size]) {
            isOutOfStock.push(true);
          } else {
            isOutOfStock.push(
              (productsData[productId].stock[size] as number) < count
            );
          }
        });

        return {
          ...acc,
          totalPrice:
            acc.totalPrice + productsData[productId].price * orderCount,
          totalCount: acc.totalCount + orderCount,
        };
      },
      { totalCount: 0, totalPrice: 0, orderCount: Object.keys(cart).length }
    );

    return { ...calc, outOfStock: isOutOfStock.some((el) => el) };
  };

  return calcCart(cart, productsData);
};

export default useCartSummary;

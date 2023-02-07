import {
  CartSummaryData,
  CartType,
  ProductListType,
  SizeType,
  StockType,
  UserData,
} from "../types";

/**
 * 카트 내 아이템의 품절 여부, 주문 수, 제품 수, 총 금액 계산
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
    const isInvalid: Array<boolean> = [];

    const validItems: Array<[string, StockType]> = [];

    Object.entries(cart).forEach((cartItem) => {
      if (
        productsData.hasOwnProperty(cartItem[0]) &&
        productsData[cartItem[0]] !== null
      ) {
        isInvalid.push(false);
        validItems.push(cartItem);
      } else {
        isInvalid.push(true);
      }
    });

    if (validItems?.length === 0) return null;

    const calc = validItems.reduce(
      (acc, cur) => {
        const [productId, options] = cur;

        let orderCount = 0;

        Object.entries(options).forEach((el) => {
          const [size, count] = el as [SizeType, number];

          orderCount += count;

          if (!productsData[productId]?.stock[size]) {
            isOutOfStock.push(true);
          } else {
            isOutOfStock.push(
              (productsData[productId]?.stock[size] as number) < count
            );
          }
        });

        return {
          ...acc,
          totalPrice:
            acc.totalPrice +
            (productsData[productId]?.price as number) * orderCount,
          totalCount: acc.totalCount + orderCount,
        };
      },
      { totalCount: 0, totalPrice: 0, orderCount: Object.keys(cart).length }
    );

    return {
      ...calc,
      outOfStock: isOutOfStock.some((el) => el),
      invalidProduct: isInvalid.some((el) => el),
    };
  };

  return calcCart(cart, productsData);
};

export default useCartSummary;

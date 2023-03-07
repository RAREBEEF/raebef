import Image from "next/image";
import Link from "next/link";
import { MouseEvent, ReactNode } from "react";
import useCart from "../hooks/useCart";
import {
  CartSummaryData,
  CartType,
  ProductListType,
  SizeType,
  UserData,
} from "../types";

interface Props {
  productsData: ProductListType | null;
  cart: CartType | null;
  userData?: UserData;
  cartSummary: CartSummaryData | null;
  triggerModal?: Function;
  withoutDeleteBtn?: boolean;
  withoutStockInfo?: boolean;
}

const CartItemList: React.FC<Props> = ({
  productsData,
  cart,
  userData,
  cartSummary,
  triggerModal,
  withoutDeleteBtn = false,
  withoutStockInfo = false,
}) => {
  const { remove } = useCart();

  const cartItemGenerator = (products: ProductListType) => {
    if (!products || !cart) return;

    const itemList: Array<ReactNode> = [];

    Object.entries(products).forEach((el, i) => {
      const [id, product] = el;

      if (!cart[id]) {
        return;
      }

      const sizes = Object.entries(cart[id]);

      const deleteClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!userData || !userData.user?.uid || !triggerModal) return;

        remove
          .mutateAsync({ uid: userData.user?.uid, productId: id })
          .then(() => triggerModal(1500))
          .catch((error) => {
            console.error(error);
          });
      };

      itemList.push(
        <li
          key={i}
          className="relative flex items-center justify-between gap-12 whitespace-nowrap border-b border-zinc-200 p-5 text-xl font-semibold text-zinc-800 xs:px-2"
        >
          {product ? (
            <Link
              href={{
                pathname: `/products/product/${product.id}`,
                query: { inapp: "true" },
              }}
              className="relative aspect-square h-full min-w-[100px] basis-[15%]"
            >
              <Image
                src={product.thumbnail.src}
                alt={product.name}
                fill
                className="object-contain"
              />
            </Link>
          ) : (
            <div className="flex aspect-square min-w-[100px] basis-[15%] items-center rounded-lg bg-zinc-100"></div>
          )}
          <div className="flex basis-[85%] flex-wrap items-center justify-between gap-5">
            {product ? (
              <div className="flex basis-[30%] flex-col items-start justify-between">
                <Link
                  href={{
                    pathname: `/products/product/${product.id}`,
                    query: { inapp: "true" },
                  }}
                >
                  <h3>{product.name}</h3>
                </Link>
                <span className="text-right text-base text-zinc-400">
                  {product.price.toLocaleString("ko-KR")} ₩
                </span>
              </div>
            ) : (
              <div className="whitespace-normal break-keep text-lg">
                삭제되었거나 존재하지 않는 제품입니다.
              </div>
            )}
            {product && (
              <div className="basis-[30%] text-center text-sm text-zinc-500">
                {sizes.map((el, i) => {
                  const [size, orderCount] = el as [SizeType, number];
                  const isOutOfStock =
                    !withoutStockInfo &&
                    (product.stock[size] as number) < orderCount;

                  return (
                    <div
                      key={i}
                      className={`${isOutOfStock && "text-red-500"}`}
                    >
                      {size.toUpperCase()} : {orderCount}개{" "}
                      {isOutOfStock &&
                        (product.stock[size] === 0 ? "(품절)" : "(재고 초과)")}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex grow justify-end gap-5 md:w-full">
              {product && (
                <span>
                  {(
                    Object.values(cart[id]).reduce((acc, cur) => acc + cur, 0) *
                    product.price
                  ).toLocaleString("ko-KR")}{" "}
                  ₩
                </span>
              )}
              {!withoutDeleteBtn && (
                <button
                  onClick={deleteClick}
                  className="font-semibold text-zinc-400 hover:text-zinc-600"
                >
                  X
                </button>
              )}
            </div>
          </div>
        </li>
      );
    });

    return itemList;
  };

  return (
    <div>
      <div className="text-left text-base font-semibold text-zinc-500">
        {cartSummary?.orderCount || 0}개 품목
      </div>
      <ul className="flex flex-col py-5">
        {!productsData || Object.keys(productsData).length === 0 ? (
          <p className="flex grow flex-col items-center justify-center break-keep border-y py-16 text-center text-lg font-semibold text-zinc-600">
            카트가 비어있습니다.
          </p>
        ) : (
          cartItemGenerator(productsData)
        )}
      </ul>

      <div className="mt-5 px-5 text-end xs:px-2">
        <div className="mb-5 font-semibold">
          <div className="text-base text-zinc-500">
            {cartSummary?.totalCount || 0}개 제품
          </div>
          <div className="text-3xl text-zinc-800">
            {cartSummary?.totalPrice?.toLocaleString("ko-KR") || 0} ₩
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemList;

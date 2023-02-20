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
          className="relative p-5 flex items-center justify-between gap-12 text-zinc-800 font-semibold text-xl border-b border-zinc-200 whitespace-nowrap xs:px-2"
        >
          {product ? (
            <Link
              href={`/products/product/${product.id}`}
              className="relative basis-[15%] min-w-[100px] h-full aspect-square"
            >
              <Image
                src={product.thumbnail.src}
                alt={product.name}
                fill
                className="object-contain"
              />
            </Link>
          ) : (
            <div className="min-w-[100px] basis-[15%] bg-zinc-100 flex items-center aspect-square rounded-lg"></div>
          )}
          <div className="flex gap-5 items-center justify-between flex-wrap basis-[85%]">
            {product ? (
              <div className="basis-[30%] flex flex-col justify-between items-start">
                <Link href={`/products/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>
                <span className="text-zinc-400 text-base text-right">
                  {product.price.toLocaleString("ko-KR")} ₩
                </span>
              </div>
            ) : (
              <div className="break-keep text-lg whitespace-normal">
                삭제되었거나 존재하지 않는 제품입니다.
              </div>
            )}
            {product && (
              <div className="text-center basis-[30%] text-sm text-zinc-500">
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
            <div className="flex justify-end gap-5 grow md:w-full">
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
      <div className="font-semibold text-left text-base text-zinc-500">
        {cartSummary?.orderCount || 0}개 품목
      </div>
      <ul className="flex flex-col py-5">
        {!productsData || Object.keys(productsData).length === 0 ? (
          <p className="border-y grow flex flex-col items-center justify-center py-16 text-center text-zinc-600 text-lg font-semibold break-keep">
            카트가 비어있습니다.
          </p>
        ) : (
          cartItemGenerator(productsData)
        )}
      </ul>

      <div className="mt-5 text-end px-5 xs:px-2">
        <div className="font-semibold mb-5">
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

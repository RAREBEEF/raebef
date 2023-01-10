import Image from "next/image";
import { MouseEvent, ReactNode, useEffect, useState } from "react";
import useCart from "../hooks/useCart";
import { CartType, ProductListType, SizeType, UserData } from "../types";
import Button from "./Button";

interface Props {
  products: ProductListType | undefined;
  cart: CartType | undefined;
  userData: UserData | undefined | null;
  triggerModal: Function;
}

const CartItemList: React.FC<Props> = ({
  products,
  cart,
  userData,
  triggerModal,
}) => {
  const cartErrorHandler = () => {
    window.alert(
      "카트 추가/제거 중 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
    );
  };
  const { remove } = useCart(cartErrorHandler);
  const [cartSummary, setCartSummary] = useState<{
    totalPrice: number;
    totalCount: number;
    orderCount: number;
    outOfStock: boolean;
  } | null>(null);

  const cartItemGenerator = (products: ProductListType) => {
    if (!products || !cart || !userData) return;

    const itemList: Array<ReactNode> = [];

    Object.entries(products).forEach((el, i) => {
      const [id, product] = el;

      if (!cart[id]) return;

      const sizes = Object.entries(cart[id]);

      const deleteClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!userData.user?.uid) return;

        remove.mutate({ uid: userData.user?.uid, productId: id });
        triggerModal(1500);
      };

      itemList.push(
        <li
          key={i}
          className="relative p-5 flex items-center justify-between gap-5 flex-wrap text-zinc-800 font-semibold text-xl border-b border-zinc-200 whitespace-nowrap xs:px-2"
        >
          <div className="relative basis-[10%] h-full aspect-square">
            <Image
              src={product.thumbnail.src}
              alt={product.name}
              layout="fill"
            />
          </div>
          <div className="basis-[30%] flex items-center justify-between lg:grow lg:gap-x-12 lg:justify-start md:flex-col md:items-start md:justify-center">
            <h3>{product.name}</h3>
            <span className="text-zinc-400 text-base text-right">
              {product.price.toLocaleString("ko-KR")} ₩
            </span>
          </div>
          <div className="text-center basis-[30%] text-sm text-zinc-500 lg:basis-0">
            {sizes.map((el, i) => {
              const size = el[0] as SizeType;
              const orderCount = el[1] as number;
              const isOutOfStock = (product.stock[size] as number) < orderCount;

              return (
                <div key={i} className={`${isOutOfStock && "text-red-500"}`}>
                  {size.toUpperCase()} : {orderCount}개{" "}
                  {isOutOfStock && "(품절)"}
                </div>
              );
            })}
          </div>
          <div className="flex grow justify-end gap-5 lg:w-full">
            <span>
              {(
                Object.values(cart[id]).reduce((acc, cur) => acc + cur, 0) *
                product.price
              ).toLocaleString("ko-KR")}{" "}
              ₩
            </span>
            <button
              onClick={deleteClick}
              className="font-semibold text-zinc-400 hover:text-zinc-600"
            >
              X
            </button>
          </div>
        </li>
      );
    });

    return itemList;
  };

  // 품절 여부, 주문 수, 제품 수, 총 금액 계산
  useEffect(() => {
    if (!userData || !products) return;

    const calcCart = (cart: CartType, products: ProductListType) => {
      const stockStatus: Array<boolean> = [];

      const calc = Object.entries(cart).reduce(
        (acc, cur) => {
          const [productId, options] = cur;
          let orderCount = 0;

          Object.entries(options).forEach((el) => {
            const size = el[0] as SizeType;
            const count = el[1];
            orderCount += count;

            if (!products[productId].stock[size]) {
              stockStatus.push(false);
            } else {
              stockStatus.push(
                (products[productId].stock[size] as number) < count
              );
            }
          });

          return {
            ...acc,
            totalPrice: acc.totalPrice + products[productId].price * orderCount,
            totalCount: acc.totalCount + orderCount,
          };
        },
        { totalCount: 0, totalPrice: 0, orderCount: Object.keys(cart).length }
      );

      return { ...calc, outOfStock: stockStatus.some((el) => el) };
    };

    setCartSummary(calcCart(userData.cart, products));
  }, [products, userData]);

  return (
    <section className="px-12 xs:px-5">
      <div className="font-semibold text-base text-zinc-500 mb-5">
        {cartSummary?.orderCount || 0}개 주문
      </div>
      {!products || Object.keys(products).length === 0 ? (
        <p className="border-y py-16 text-center text-zinc-600 text-lg font-semibold break-keep">
          카트가 비어있습니다.
        </p>
      ) : (
        <ul className="flex flex-col border-t">
          {cartItemGenerator(products)}
        </ul>
      )}
      <div className="mt-5 text-end px-5 xs:px-2">
        <div className="font-semibold mb-5">
          <div className="text-base text-zinc-500">
            {cartSummary?.totalCount || 0}개 제품
          </div>
          <div className="text-3xl text-zinc-800">
            {cartSummary?.totalPrice?.toLocaleString("ko-KR") || 0} ₩
          </div>
        </div>
        <Button
          theme="black"
          disabled={
            !cartSummary ||
            cartSummary.orderCount === 0 ||
            cartSummary?.outOfStock
          }
          href={"/purchase"}
        >
          결제하기
        </Button>
      </div>
    </section>
  );
};

export default CartItemList;

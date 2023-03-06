import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
} from "react";
import { ProductType, SizeType, TempCartType } from "../types";

interface Props {
  product: ProductType;
  tempCart: TempCartType;
  setTempCart: Dispatch<SetStateAction<TempCartType>>;
}

const CartTempItemList: React.FC<Props> = ({
  product,
  tempCart,
  setTempCart,
}) => {
  const cartTempItemGenerator = (
    tempCart: TempCartType,
    setTempCart: Dispatch<SetStateAction<TempCartType>>
  ) => {
    const itemList: Array<ReactNode> = [];

    Object.keys(tempCart).forEach((key, i) => {
      const size = key as SizeType;
      const stock = product.stock[size];

      /**
       *
       * @param orderCount 주문 수량
       * @returns 주문 수량이 재고량과 같거나 클 경우 `true`, 그 외 `false`
       */
      const isOutOfStock = (orderCount: number) => {
        if (!stock) return true;

        return orderCount >= stock;
      };

      // 주문 수량 증가
      const increaseCount = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTempCart((prev) => ({
          ...prev,
          [size]: !prev[size] ? 1 : (prev[size] as number) + 1,
        }));
      };

      // 주문 수량 감소
      const decreaseCount = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTempCart((prev) => ({
          ...prev,
          [size]: (prev[size] as number) - 1,
        }));
      };

      // 임시 카트 아이템 제거
      const deleteItem = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTempCart((prev) => {
          const newTempCart = { ...prev };

          delete newTempCart[size];

          return newTempCart;
        });
      };

      const onCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { value } = e.target;

        setTempCart((prev) => {
          const newTempCart = { ...prev };

          if (value === "") {
            newTempCart[size] = "";
          } else if (value === "0") {
            newTempCart[size] = 1;
          } else if (isOutOfStock(parseInt(value))) {
            newTempCart[size] = stock as number;
          } else {
            newTempCart[size] = parseInt(value);
          }
          return newTempCart;
        });
      };

      itemList.push(
        <li
          key={i}
          className="mx-2 flex h-fit flex-wrap items-center justify-between gap-5 whitespace-nowrap border-b border-zinc-200 px-2 py-2"
        >
          <div className="flex gap-10">
            <h5 className="w-10 text-lg font-semibold">
              {size === "other" ? "기본" : size.toUpperCase()}
            </h5>

            <div className="flex w-20 justify-between overflow-hidden rounded-md bg-zinc-100 xs:w-16">
              <button
                onClick={decreaseCount}
                className={`w-6 bg-zinc-200 p-1 font-mono font-bold text-zinc-600 ${
                  (tempCart[size] as number) <= 1
                    ? "pointer-events-none bg-zinc-200 text-zinc-400"
                    : "pointer-events-auto"
                }`}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                className="input--number w-10 grow text-center font-mono xs:w-8"
                value={tempCart[size]}
                onChange={onCountChange}
              ></input>
              <button
                onClick={increaseCount}
                className={`w-6 bg-zinc-200 p-1 font-mono font-bold text-zinc-600 ${
                  isOutOfStock(tempCart[size] as number)
                    ? "pointer-events-none bg-zinc-200 text-zinc-400"
                    : "pointer-events-auto"
                }`}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex grow justify-end gap-5">
            <div className="w-fit text-right font-mono">
              {product?.price &&
                tempCart[size] &&
                (product.price * (tempCart[size] as number)).toLocaleString(
                  "ko-KR"
                )}{" "}
              ₩
            </div>
            <button
              onClick={deleteItem}
              className="font-semibold text-zinc-400 hover:text-zinc-600"
            >
              X
            </button>
          </div>
          <style jsx>{`
            .input--number {
              &::-webkit-outer-spin-button,
              &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }

              -moz-appearance: textfield;
            }
          `}</style>
        </li>
      );
    });

    return itemList;
  };

  return (
    <ul
      className={`flex flex-col gap-2 overflow-hidden rounded-md border border-zinc-200 py-2 px-2 text-left text-zinc-800 transition-all ${
        Object.keys(tempCart).length >= 1 ? "h-fit" : "h-0 border-none p-0"
      }`}
    >
      {cartTempItemGenerator(tempCart, setTempCart)}
      <div className="my-3 flex justify-between px-4 text-lg font-semibold">
        <span>총 제품 금액 </span>
        <span>
          {(
            (Object.values(tempCart).reduce((acc, cur) => {
              return typeof cur === "number" ? (acc as number) + cur : acc;
            }, 0) as number) * product.price
          ).toLocaleString("ko-KR")}{" "}
          ₩
        </span>
      </div>
    </ul>
  );
};

export default CartTempItemList;

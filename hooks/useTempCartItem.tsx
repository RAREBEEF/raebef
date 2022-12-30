import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
} from "react";
import { ProductType, SizeType } from "../types";

export type tempCartType = { [key in SizeType]?: number | "" };

/**
 * 임시 카트 아이템 생성기를 반환하는 훅
 * @param product 재고량과 가격을 체크하기 위해 제품 객체 전달
 * @returns `tempCartItemGenerator`
 */
const useTempCartItemGenerator = (product: ProductType) => {
  /**
   * 임시 카트 아이템 생성기
   * @param tempCart
   * @param setTempCart
   * @returns
   */
  const tempCartItemGenerator = (
    tempCart: tempCartType,
    setTempCart: Dispatch<SetStateAction<tempCartType>>
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
        if (!stock) return false;

        return orderCount >= stock;
      };

      // 주문 수량 증가
      const increaseCount = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTempCart((prev) => {
          const newTempCart = { ...prev };

          if (!newTempCart[size]) {
            newTempCart[size] = 1;
          } else {
            (newTempCart[size] as number) += 1;
          }

          return newTempCart;
        });
      };

      // 주문 수량 감소
      const decreaseCount = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTempCart((prev) => {
          const newTempCart = { ...prev };

          (newTempCart[size] as number) -= 1;

          return newTempCart;
        });
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
          className="h-fit mx-2 px-2 py-2 flex flex-wrap justify-between items-center gap-x-10 gap-y-5 border-b border-zinc-200 whitespace-nowrap"
        >
          <h5 className="w-10 font-semibold text-lg">{size.toUpperCase()}</h5>
          <div className="w-24 bg-zinc-100 flex justify-between xs:w-16">
            <button
              onClick={decreaseCount}
              className={`font-bold bg-zinc-200 p-1 font-mono text-zinc-600 ${
                (tempCart[size] as number) <= 1
                  ? "pointer-events-none text-zinc-300"
                  : "pointer-events-auto"
              }`}
            >
              -
            </button>
            <input
              type="number"
              min={1}
              className="input--number grow w-10 text-center font-mono"
              value={tempCart[size]}
              onChange={onCountChange}
            ></input>
            <button
              onClick={increaseCount}
              className={`font-bold bg-zinc-200 p-1 font-mono text-zinc-600 ${
                isOutOfStock(tempCart[size] as number)
                  ? "pointer-events-none text-zinc-300"
                  : "pointer-events-auto"
              }`}
            >
              +
            </button>
          </div>
          <div className="flex grow justify-end gap-5">
            <div className="w-fit font-mono text-right">
              {product?.price &&
                tempCart[size] &&
                (product.price * (tempCart[size] as number)).toLocaleString(
                  "ko-KR"
                )}{" "}
              ₩
            </div>
            <button
              onClick={deleteItem}
              className="font-semibold text-zinc-400"
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

  return tempCartItemGenerator;
};

export default useTempCartItemGenerator;

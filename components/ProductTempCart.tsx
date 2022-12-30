import { ChangeEvent, ReactNode, useState } from "react";
import useTempCartItemGenerator, {
  tempCartType,
} from "../hooks/useTempCartItem";
import { ProductType, SizeType } from "../types";
import Button from "./Button";

interface Props {
  product: ProductType;
}

const ProductTempCart: React.FC<Props> = ({ product }) => {
  const tempCartItemGenerator = useTempCartItemGenerator(product);
  const [tempCart, setTempCart] = useState<tempCartType>({});

  // 사이즈 드롭다운 옵션 생성하기
  const sizeOptionGenerator = (product: ProductType) => {
    const optionList = Array<ReactNode>([]);
    // 사이즈 정렬 기준
    const sizeOrder = {
      xs: 0,
      s: 1,
      m: 2,
      l: 3,
      xl: 4,
      xxl: 5,
      xxxl: 6,
    };

    Object.keys(product.stock)
      .sort((a, b) => {
        return sizeOrder[a as SizeType] - sizeOrder[b as SizeType];
      })
      .forEach((key, i) => {
        const size = key as SizeType;

        optionList.push(
          <option value={size} key={i} disabled={!product.stock[size]}>
            {size.toUpperCase()}{" "}
            {product.stock[size as SizeType]
              ? `(재고 : ${product.stock[size]})`
              : "(품절)"}
          </option>
        );
      });

    return optionList;
  };

  // 사이즈 선택 시 임시 카트에 아이템 추가
  const onSelectSize = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const size = e.target.value as SizeType;

    if (!Object.keys(tempCart).find((key) => key === size))
      setTempCart((prev) => {
        const newTempCart = { ...prev };

        newTempCart[size] = 1;

        return newTempCart;
      });
  };

  return (
    <form className="mt-auto pt-5 flex flex-col gap-3">
      <select
        className="cursor-pointer w-[100%] px-4 py-2 mx-auto bg-zinc-200 rounded-md text-center text-lg font-semibold text-zinc-600 break-keep transition-all hover:bg-zinc-100"
        onChange={onSelectSize}
        value="size"
      >
        <option value="size" disabled>
          사이즈 선택
        </option>
        {sizeOptionGenerator(product)}
      </select>

      <ul
        className={`overflow-hidden flex flex-col gap-2 text-zinc-800 text-left border border-zinc-200 rounded-md py-2 px-2 transition-all ${
          Object.keys(tempCart).length >= 1 ? "h-fit" : "h-0 p-0 border-none"
        }`}
      >
        {tempCartItemGenerator(tempCart, setTempCart)}
        <div className="px-4 my-3 flex justify-between text-lg font-semibold">
          <span>총 제품 금액 </span>
          <span>
            {(
              Object.keys(tempCart).reduce((acc, key) => {
                const size = key as SizeType;
                return tempCart[size] ? acc + (tempCart[size] as number) : acc;
              }, 0) * product.price
            ).toLocaleString("ko-KR")}{" "}
            ₩
          </span>
        </div>
      </ul>

      <Button tailwindStyles="w-[100%] mx-auto text-lg">북마크에 추가</Button>
      <Button tailwindStyles="w-[100%] mx-auto text-lg ">카트에 추가</Button>
      <Button tailwindStyles="w-[100%] mx-auto text-lg bg-zinc-800 text-zinc-50 hover:bg-zinc-500">
        구매하기
      </Button>
    </form>
  );
};

export default ProductTempCart;

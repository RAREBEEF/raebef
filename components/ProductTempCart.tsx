import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, ReactNode, useState } from "react";
import useAddBookmark from "../hooks/useAddBookmark";
import useGetUserData from "../hooks/useGetUserData";
import useIsSoldOut from "../hooks/useIsSoldOut";
import useRemoveBookmark from "../hooks/useRemoveBookmark";
import useTempCartItemGenerator, {
  tempCartType,
} from "../hooks/useTempCartItem";
import { ProductType, SizeType } from "../types";
import Button from "./Button";

interface Props {
  product: ProductType;
}

const ProductTempCart: React.FC<Props> = ({ product }) => {
  const router = useRouter();
  const tempCartItemGenerator = useTempCartItemGenerator(product);
  const isSoldOut = useIsSoldOut(product.stock);
  const { data: userData } = useGetUserData();

  const bookmarkErrorHandler = () => {
    window.alert(
      "북마크 추가/제거 중 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
    );
  };

  const { mutate: addBookmark } = useAddBookmark(bookmarkErrorHandler);
  const { mutate: removeBookmark } = useRemoveBookmark(bookmarkErrorHandler);
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
        const stock = product.stock[size as SizeType];
        optionList.push(
          <option value={size} key={i} disabled={!product.stock[size]}>
            {size.toUpperCase()}{" "}
            {stock ? stock <= 10 && `(${stock}개 남음)` : "품절"}
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

  // 북마크 추가/제거
  const onToggleBookmark = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userData?.user?.uid) {
      router.push({
        pathname: "/login",
        query: { from: `/products/${product.id}` },
      });
    } else if (userData?.bookmark?.includes(product.id)) {
      removeBookmark({ uid: userData?.user?.uid, productId: product.id });
    } else {
      addBookmark({ uid: userData?.user?.uid, productId: product.id });
    }
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
              (Object.values(tempCart).reduce((acc, cur) => {
                return typeof cur === "number" ? (acc as number) + cur : acc;
              }, 0) as number) * product.price
            ).toLocaleString("ko-KR")}{" "}
            ₩
          </span>
        </div>
      </ul>

      <Button
        onClick={onToggleBookmark}
        tailwindStyles="w-[100%] mx-auto text-lg"
      >
        {userData?.bookmark?.includes(product.id)
          ? "북마크에서 제거"
          : "북마크에 추가"}
      </Button>
      <Button
        tailwindStyles={`w-[100%] mx-auto text-lg ${
          isSoldOut && "pointer-events-none bg-zinc-100 text-zinc-200"
        }`}
      >
        카트에 추가
      </Button>
      <Button
        theme="black"
        tailwindStyles={`w-[100%] mx-auto text-lg ${
          isSoldOut && "pointer-events-none bg-zinc-100 text-zinc-200"
        }`}
      >
        구매하기
      </Button>
    </form>
  );
};

export default ProductTempCart;

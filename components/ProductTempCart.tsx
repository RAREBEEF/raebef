import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from "react";
import useIsSoldOut from "../hooks/useIsSoldOut";
import useTempCartItemGenerator, {
  tempCartType,
} from "../hooks/useTempCartItem";
import useToggleBookmark from "../hooks/useToggleBookmark";
import useToggleCart from "../hooks/useToggleCart";
import { ProductType, SizeType } from "../types";
import Button from "./Button";
import Modal from "./Modal";
import useModal from "../hooks/useModal";
import heartFillIcon from "../public/icons/heart-fill.svg";
import heartIcon from "../public/icons/heart.svg";
import Image from "next/image";
import useGetUserData from "../hooks/useGetUserData";

interface Props {
  product: ProductType;
}

const ProductTempCart: React.FC<Props> = ({ product }) => {
  const tempCartItemGenerator = useTempCartItemGenerator(product);
  const { data: userData } = useGetUserData();
  const { triggerModal, showModal, setModalText, modalText } = useModal();
  const isSoldOut = useIsSoldOut(product.stock);
  const [tempCart, setTempCart] = useState<tempCartType>({});
  const { toggleCart, isInCart } = useToggleCart(product.id);
  const { toggleBookmark, isInBookmark } = useToggleBookmark(product.id);

  // 기존 카트내역 불러오기
  useEffect(() => {
    if (!userData) return;

    const { cart } = userData;

    if (cart.hasOwnProperty(product.id)) {
      setTempCart(cart[product.id]);
    }
  }, [product.id, userData]);

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

    if (!tempCart.hasOwnProperty(size))
      setTempCart((prev) => {
        const newTempCart = { ...prev };

        newTempCart[size] = 1;

        return newTempCart;
      });
  };

  const onClickBookmark = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleBookmark();
  };

  const onCartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleCart(tempCart);
    if (Object.keys(tempCart).length !== 0) {
      isInCart
        ? setModalText("카트가 변경되었습니다.")
        : setModalText("카트에 추가되었습니다.");
      triggerModal(1500);
    }
  };

  return (
    <form className="mt-auto pt-5 flex flex-col gap-3">
      <select
        className="cursor-pointer h-12 w-[100%] px-4 py-2 mx-auto bg-zinc-200 rounded-md text-center text-lg font-semibold text-zinc-600 break-keep transition-all hover:bg-zinc-100"
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
      <div className="flex gap-2">
        <Button
          onClick={onCartClick}
          tailwindStyles={`h-12 grow mx-auto text-lg`}
          disabled={isSoldOut}
        >
          {isInCart && Object.keys(tempCart).length !== 0
            ? "카트 업데이트"
            : "카트에 추가"}
        </Button>
        <Button
          onClick={onClickBookmark}
          tailwindStyles="h-12 aspect-square px-1 py-1 m-auto overflow-hidden"
        >
          <Image
            src={isInBookmark ? heartFillIcon : heartIcon}
            alt="찜하기"
            className="m-auto transition-transform duration-500 active:duration-100 active:scale-150"
            width="24"
            height="24"
          />
        </Button>
      </div>
      <Button
        theme="black"
        tailwindStyles={`h-12 w-[100%] mx-auto text-lg `}
        disabled={isSoldOut}
      >
        구매하기
      </Button>
      <Modal show={showModal} text={modalText} />
    </form>
  );
};

export default ProductTempCart;

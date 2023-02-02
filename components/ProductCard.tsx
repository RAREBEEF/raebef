import Image from "next/image";
import Link from "next/link";
import heartFillIcon from "../public/icons/heart-fill.svg";
import heartIcon from "../public/icons/heart.svg";
import { ProductType } from "../types";
import useIsSoldOut from "../hooks/useIsSoldOut";
import useToggleBookmark from "../hooks/useToggleBookmark";

interface Props {
  product: ProductType;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { toggleBookmark, isInBookmark } = useToggleBookmark(product.id);
  const isSoldOut = useIsSoldOut(product);

  return (
    <li className="relative group aspect-[4/5] xs:aspect-auto">
      <div className="w-6 absolute right-3 top-3 flex flex-col justify-center items-center gap-1 z-10">
        <button onClick={toggleBookmark}>
          <Image
            src={isInBookmark ? heartFillIcon : heartIcon}
            alt="찜하기"
            className="transition-transform duration-500 hover:scale-110 active:duration-100 active:scale-150"
          />
        </button>
      </div>
      <Link
        href={`/products/product/${product.id}`}
        className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 border border-zinc-300 rounded-md overflow-hidden text-center bg-white md:gap-0 xs:flex-row xs:px-2`}
      >
        <div className="relative grow w-full xs:grow-0 xs:basis-[50%] xs:aspect-[4/5]">
          <Image
            className="transition-transform duration-500 group-hover:scale-105"
            src={product.thumbnail.src}
            sizes="150px"
            fill
            alt={product.name}
            objectFit="contain"
          />
          {isSoldOut && (
            <h5 className="pointer-events-none z-20 absolute h-fit w-fit px-4 py-2 top-0 bottom-0 left-0 right-0 m-auto rotate-[-25deg] text-center font-bold text-4xl text-[white] whitespace-nowrap bg-zinc-800 opacity-90 transition-opacity duration-500 group-hover:opacity-50 xl:text-2xl xs:text-xl">
              SOLD OUT
            </h5>
          )}
        </div>
        <div className="xs:basis-[50%]">
          <h4 className="relative px-2 text-lg font-semibold leading-6 sm:text-base sm:leading-5 xs:text-xl">
            {product.name}
          </h4>
          <span className="relative text-zinc-400 xs:text-base">
            {product.price.toLocaleString("ko-KR")} ₩
          </span>
        </div>
      </Link>
    </li>
  );
};

export default ProductCard;

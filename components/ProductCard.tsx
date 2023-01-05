import Image from "next/image";
import Link from "next/link";
import heartIcon from "../public/icons/heart.svg";
import cartIcon from "../public/icons/cart-button.svg";
import { ProductType } from "../types";
import { useEffect, useState } from "react";
import useIsSoldOut from "../hooks/useIsSoldOut";

interface Props {
  product: ProductType;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const isSoldOut = useIsSoldOut(product.stock);

  return (
    <li
      className={`relative group aspect-[4/5] w-[20%] lg:w-[35%] md:w-[40%] sm:w-[40%] xs:w-[40%] 2xs:w-[100%]`}
    >
      <div className="w-6 absolute right-3 top-3 flex flex-col justify-center items-center gap-1 z-10">
        <button>
          <Image
            src={heartIcon}
            alt="찜하기"
            className="transition-transform duration-500 hover:scale-110 active:duration-100 active:scale-150"
          />
        </button>
      </div>
      <Link
        href={`/products/${product.id}`}
        className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 border border-zinc-300 rounded-md overflow-hidden text-center bg-white md:gap-0`}
      >
        <div className="relative grow w-full">
          <Image
            className="transition-transform duration-500 group-hover:scale-105"
            src={product.thumbnail.src}
            sizes="150px"
            fill
            alt={product.name}
            objectFit="contain"
          />
          {isSoldOut && (
            <h5 className="pointer-events-none z-20 absolute h-fit w-fit px-4 py-2 top-0 bottom-0 left-0 right-0 m-auto rotate-[-25deg] text-center font-bold text-4xl text-[white] whitespace-nowrap bg-zinc-800 opacity-90 transition-opacity duration-500 group-hover:opacity-50 xl:text-2xl xs:text-xl 2xs:text-4xl">
              SOLD OUT
            </h5>
          )}
        </div>
        <h4 className="relative px-2 text-lg font-semibold leading-6 sm:text-base sm:leading-5">
          {product.name}
        </h4>
        <span className="relative text-zinc-400">
          {product.price.toLocaleString("ko-KR")} ₩
        </span>
      </Link>
    </li>
  );
};

export default ProductCard;

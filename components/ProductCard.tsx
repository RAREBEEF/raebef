import Image from "next/image";
import Link from "next/link";
import { ProductType } from "../types";
import useToggleBookmark from "../hooks/useToggleBookmark";
import { useState } from "react";
import { useRouter } from "next/router";
import SkeletonProductLoading from "./SkeletonProductLoading";

interface Props {
  product: ProductType;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const router = useRouter();
  const { toggleBookmark, isInBookmark } = useToggleBookmark(product.id);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  const onProductClick = () => {
    setShowSkeleton(true);
  };

  return (
    <li className="group relative aspect-[4/5] xs:aspect-auto">
      {/* {showSkeleton && <SkeletonProductLoading path={router.asPath} />} */}

      <Link
        onClick={onProductClick}
        href={{
          pathname: `/products/product/${product.id}`,
          query: { inapp: "true" },
        }}
        className={`group-hover:rotate-y-180 relative flex h-full shrink-0 flex-col items-center justify-between gap-2 overflow-hidden rounded-md border border-zinc-50 bg-white py-2 text-center shadow-lg shadow-zinc-300 transition-all duration-500 group-hover:shadow-zinc-400 xs:flex-row xs:px-2`}
      >
        <div className="relative w-full grow xs:aspect-[4/5] xs:grow-0 xs:basis-[40%] 2xs:basis-[50%]">
          <Image
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            src={product.thumbnail.src}
            sizes="(max-width: 639px) 40vw,
            (max-width: 1023px) 30vw,
            20vw"
            fill
            alt={product.name}
          />
          {product.totalStock <= 0 && (
            <h5 className="pointer-events-none absolute top-0 bottom-0 left-0 right-0 z-20 m-auto h-fit w-fit rotate-[-25deg] whitespace-nowrap bg-zinc-800 px-4 py-2 text-center text-3xl font-bold text-[white] opacity-90 transition-opacity duration-500 group-hover:opacity-50 2xl:text-4xl md:text-xl">
              SOLD OUT
            </h5>
          )}
        </div>
        <div className="xs:basis-[50%]">
          <h4 className="relative break-keep px-2 text-lg font-semibold leading-6 sm:text-base sm:leading-5 xs:text-xl">
            {product.name}
          </h4>
          <span className="relative text-zinc-400 xs:text-base">
            {product.price.toLocaleString("ko-KR")} ₩
          </span>
        </div>
      </Link>
      <div className="absolute right-3 top-0 flex w-[15%] flex-col items-center justify-center gap-1 overflow-hidden md:w-[20%] sm:w-[17%] xs:w-[10%] 2xs:w-[12%]">
        <button onClick={toggleBookmark}>
          {/* <Image
            src={isInBookmark ? bookmarkFillIcon : bookmarkIcon}
            alt="북마크"
            className="origin-top transition-transform duration-500 translate-y-[-50%] hover:translate-y-[-40%] active:duration-100 active:translate-y-[-20%]"
          /> */}
          <img
            src={
              isInBookmark ? "/icons/bookmark-fill.svg" : "/icons/bookmark.svg"
            }
            alt="북마크"
            className="w-full origin-top translate-y-[-50%] transition-transform duration-500 hover:translate-y-[-40%] active:translate-y-[-20%] active:duration-100"
          />
        </button>
      </div>
    </li>
  );
};

export default ProductCard;

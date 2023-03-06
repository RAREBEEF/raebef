import Image from "next/image";
import Link from "next/link";
import useToggleBookmark from "../hooks/useToggleBookmark";
import { ProductType } from "../types";

interface Props {
  product: ProductType;
  slideItemWidth: number;
}

const CollectionSectionSlideItem: React.FC<Props> = ({
  product,
  slideItemWidth,
}) => {
  const { toggleBookmark, isInBookmark } = useToggleBookmark(product.id);

  return (
    <li
      className="group relative aspect-[4/5] px-4 lg:aspect-[6/4]  md:aspect-[5/6] xs:aspect-[5/4]"
      style={{ width: `${slideItemWidth}px` }}
    >
      <Link
        href={`/products/product/${product.id}`}
        className={`relative flex h-full shrink-0 flex-col items-center justify-between gap-2 overflow-hidden rounded-md py-2 text-center shadow-lg shadow-zinc-300 transition-all duration-500 group-hover:shadow-zinc-400`}
      >
        <div className="relative w-full grow">
          <Image
            className="relative object-contain transition-transform duration-500 group-hover:scale-105"
            src={product.thumbnail.src}
            sizes={`${slideItemWidth}px`}
            alt={product.name}
            fill
          />
          {product.totalStock <= 0 && (
            <h5 className="pointer-events-none absolute top-0 bottom-0 left-0 right-0 z-20 m-auto h-fit w-fit rotate-[-25deg] whitespace-nowrap bg-zinc-800 px-4 py-2 text-center text-4xl font-bold text-[white] opacity-90 transition-opacity duration-500 group-hover:opacity-50 xl:text-2xl xs:text-xl">
              SOLD OUT
            </h5>
          )}
        </div>
        <h4 className="relative break-keep px-2 text-lg font-semibold leading-5">
          {product.name}
        </h4>
        <span className="relative text-zinc-400">
          {product.price.toLocaleString("ko-KR")} ₩
        </span>
      </Link>
      <div className="absolute right-8 top-0 z-10 flex w-[15%] flex-col items-center justify-center gap-1 overflow-hidden lg:w-[10%] md:w-[12%] sm:w-[15%] xs:w-[10%] 2xs:w-[15%]">
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

export default CollectionSectionSlideItem;

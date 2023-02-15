import Image from "next/image";
import Link from "next/link";
import useToggleBookmark from "../hooks/useToggleBookmark";
import bookmarkFillIcon from "../public/icons/bookmark-fill.svg";
import bookmarkIcon from "../public/icons/bookmark.svg";
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
    <li className="group relative aspect-[4/5] lg:aspect-[6/4] md:aspect-[5/4]">
      <Link
        href={`/products/product/${product.id}`}
        className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 border border-zinc-300 rounded-md overflow-hidden text-center`}
        style={{ width: `${slideItemWidth}px` }}
      >
        <div className="relative grow w-full">
          <Image
            className="transition-transform duration-500 group-hover:scale-105 object-contain"
            src={product.thumbnail.src}
            sizes="150px"
            alt={product.name}
            fill
          />
        </div>
        <h4 className="relative px-2 text-lg font-semibold leading-5">
          {product.name}
        </h4>
        <span className="relative text-zinc-400">
          {product.price.toLocaleString("ko-KR")} ₩
        </span>
      </Link>
      <div className="overflow-hidden w-[15%] absolute right-3 top-0 flex flex-col justify-center items-center gap-1 z-10 lg:w-[10%] md:w-[12%] sm:w-[15%] xs:w-[10%] 2xs:w-[15%]">
        <button onClick={toggleBookmark}>
          <Image
            src={isInBookmark ? bookmarkFillIcon : bookmarkIcon}
            alt="북마크"
            className="origin-top transition-transform duration-500 translate-y-[-50%] hover:translate-y-[-40%] active:duration-100 active:translate-y-[-20%]"
          />
        </button>
      </div>
    </li>
  );
};

export default CollectionSectionSlideItem;

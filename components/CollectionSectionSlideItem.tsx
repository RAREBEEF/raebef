import Image from "next/image";
import Link from "next/link";
import useToggleBookmark from "../hooks/useToggleBookmark";
import heartIcon from "../public/icons/heart.svg";
import heartFillIcon from "../public/icons/heart-fill.svg";
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
    <li className="group relative">
      <div className="w-6 absolute right-3 top-3 flex flex-col justify-center items-center gap-1 z-10">
        <button onClick={toggleBookmark}>
          <Image
            src={isInBookmark ? heartFillIcon : heartIcon}
            alt="찜하기"
            className="transition-transform duration-500 hover:scale-110 active:duration-200 active:scale-150"
          />
        </button>
      </div>
      <Link
        href={`/products/product/${product.id}`}
        className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 border border-zinc-300 rounded-md overflow-hidden text-center`}
        style={{ width: `${slideItemWidth}px` }}
      >
        <Image
          className="transition-transform duration-500 group-hover:scale-105"
          src={product.thumbnail.src}
          width={150}
          height={150}
          alt={product.name}
        />
        <h4 className="relative px-2 text-lg font-semibold leading-5">
          {product.name}
        </h4>
        <span className="relative text-zinc-400">
          {product.price.toLocaleString("ko-KR")} ₩
        </span>
      </Link>
    </li>
  );
};

export default CollectionSectionSlideItem;

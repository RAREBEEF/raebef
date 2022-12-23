import Image from "next/image";
import Link from "next/link";
import heartIcon from "../public/icons/heart.svg";
import cartIcon from "../public/icons/cart-button.svg";
import { ProductType } from "../types";

interface Props {
  product: ProductType;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <li
      className={`relative group aspect-[4/5] w-[20%] lg:w-[35%] md:w-[40%] sm:w-[40%] xs:w-[40%] 2xs:w-[100%]`}
    >
      <div className="w-6 absolute right-3 top-2 flex flex-col justify-center items-center gap-1 z-10">
        <button>
          <Image
            src={heartIcon}
            alt="찜하기"
            className="transition-transform duration-500 hover:scale-110 active:duration-100 active:scale-150"
          />
        </button>
        <button>
          <Image
            src={cartIcon}
            alt="장바구니에 담기"
            className="stroke-white transition-transform duration-500 hover:scale-110 active:duration-100 active:scale-150"
          />
        </button>
      </div>
      <Link
        href={`/products/${product.id}`}
        className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 border border-zinc-300 rounded-md overflow-hidden text-center bg-white md:gap-0`}
      >
        <div className="relative grow w-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={product.thumbnail.src}
            sizes="150px"
            fill
            alt={product.name}
            objectFit="contain"
          />
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

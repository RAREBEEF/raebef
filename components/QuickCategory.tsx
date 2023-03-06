import Image from "next/image";
import Link from "next/link";
import clothIcon from "../public/icons/cloth.svg";
import hatIcon from "../public/icons/hat.svg";
import shoesIcon from "../public/icons/shoes.svg";
import bagIcon from "../public/icons/bag.svg";
import jewelIcon from "../public/icons/jewel.svg";
import HeaderHomeSection from "./HeaderHomeSection";

const QuickCategory = () => {
  return (
    <section>
      <HeaderHomeSection href="/products/categories/all" text="제품 둘러보기" />
      <ul className="mx-auto flex flex-wrap justify-evenly gap-10 px-12 pb-24 text-lg font-semibold text-zinc-800 md:grid md:grid-cols-2">
        <li className="group m-auto max-w-[100px] basis-[20%] text-center">
          <Link
            href={{
              pathname: "/products/categories/clothes/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-full border border-4 border-zinc-200">
              <Image
                src={clothIcon}
                alt="clothes"
                className="trainsiton-transform w-[70%] duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <h4>의류</h4>
          </Link>
        </li>
        <li className="group m-auto max-w-[100px] basis-[20%] text-center">
          <Link
            href={{
              pathname: "/products/categories/accessory/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-full border border-4 border-zinc-200">
              <Image
                src={hatIcon}
                alt="accessory"
                className="trainsiton-transform w-[70%] duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <h4>악세서리</h4>
          </Link>
        </li>
        <li className="group m-auto max-w-[100px] basis-[20%] text-center">
          <Link
            href={{
              pathname: "/products/categories/shoes/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-full border border-4 border-zinc-200">
              <Image
                src={shoesIcon}
                alt="shoes"
                className="trainsiton-transform w-[60%] duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <h4>신발</h4>
          </Link>
        </li>
        <li className="group m-auto max-w-[100px] basis-[20%] text-center">
          <Link
            href={{
              pathname: "/products/categories/bag/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-full border border-4 border-zinc-200">
              <Image
                src={bagIcon}
                alt="bag"
                className="trainsiton-transform w-[70%] duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <h4>가방</h4>
          </Link>
        </li>
        <li className="group m-auto max-w-[100px] basis-[20%] text-center">
          <Link
            href={{
              pathname: "/products/categories/jewel/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-full border border-4 border-zinc-200">
              <Image
                src={jewelIcon}
                alt="jewel"
                className="trainsiton-transform w-[70%] duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <h4>주얼리</h4>
          </Link>
        </li>
      </ul>

      <style jsx>{`
        .icon {
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 1000px;
            box-shadow: inset 0 0 0 1px #e4e4e7;
            transition: all 0.5s;
          }
          &:hover {
            &::before {
              box-shadow: inset 0 0 0 50px #e4e4e7;
            }
          }
        }
      `}</style>
    </section>
  );
};

export default QuickCategory;

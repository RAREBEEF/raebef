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
      <HeaderHomeSection href="/categories" text="제품 둘러보기" />
      <ul className="px-12 mx-auto flex flex-wrap gap-10 justify-evenly text-lg font-semibold text-zinc-800 md:max-w-[80%] sm:text-sm xs:max-w-full">
        <li className="group text-center max-w-[100px] basis-[20%]">
          <Link
            href={{
              pathname: "/categories/clothes/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex items-center justify-center overflow-hidden aspect-square border border-4 border-zinc-200 rounded-full">
              <Image
                src={clothIcon}
                alt="clothes"
                className="w-[70%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>의류</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px] basis-[20%]">
          <Link
            href={{
              pathname: "/categories/accessory/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex items-center justify-center overflow-hidden aspect-square border border-4 border-zinc-200 rounded-full">
              <Image
                src={hatIcon}
                alt="accessory"
                className="w-[70%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>악세서리</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px] basis-[20%]">
          <Link
            href={{
              pathname: "/categories/shoes/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex items-center justify-center overflow-hidden aspect-square border border-4 border-zinc-200 rounded-full">
              <Image
                src={shoesIcon}
                alt="shoes"
                className="w-[60%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>신발</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px] basis-[20%]">
          <Link
            href={{
              pathname: "/categories/bag/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex items-center justify-center overflow-hidden aspect-square border border-4 border-zinc-200 rounded-full">
              <Image
                src={bagIcon}
                alt="bag"
                className="w-[70%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>가방</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px] basis-[20%]">
          <Link
            href={{
              pathname: "/categories/jewel/all",
              query: { orderby: "popularity" },
            }}
          >
            <div className="icon relative mb-2 flex items-center justify-center overflow-hidden aspect-square border border-4 border-zinc-200 rounded-full">
              <Image
                src={jewelIcon}
                alt="jewel"
                className="w-[70%] trainsiton-transform duration-500 group-hover:scale-105"
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

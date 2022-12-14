import Image from "next/image";
import Link from "next/link";
import clothIcon from "../public/icons/cloth.svg";
import hatIcon from "../public/icons/hat.svg";
import shoesIcon from "../public/icons/shoes.svg";
import bagIcon from "../public/icons/bag.svg";
import jewelIcon from "../public/icons/jewel.svg";
import HomeSectionHeader from "./HomeSectionHeader";

const CategoryShortcutSection = () => {
  return (
    <section>
      <HomeSectionHeader href="/categories" text="제품 둘러보기" />
      <ul className="px-12 flex gap-10 justify-evenly text-lg font-semibold text-zinc-800 sm:text-sm">
        <li className="group text-center max-w-[100px]">
          <Link href="/categories/clothes">
            <div className="mb-2 flex items-center justify-center overflow-hidden aspect-square bg-zinc-200 rounded-full">
              <Image
                src={clothIcon}
                alt="clothes"
                className="w-[70%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>의류</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px]">
          <Link href="/categories/accessory">
            <div className="mb-2 flex items-center justify-center overflow-hidden aspect-square bg-zinc-200 rounded-full">
              <Image
                src={hatIcon}
                alt="accessory"
                className="w-[70%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>악세서리</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px]">
          <Link href="/categories/shoes">
            <div className="mb-2 flex items-center justify-center overflow-hidden aspect-square bg-zinc-200 rounded-full">
              <Image
                src={shoesIcon}
                alt="shoes"
                className="w-[60%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>신발</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px]">
          <Link href="/categories/bag">
            <div className="mb-2 flex items-center justify-center overflow-hidden aspect-square bg-zinc-200 rounded-full">
              <Image
                src={bagIcon}
                alt="bag"
                className="w-[70%] trainsiton-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4>가방</h4>
          </Link>
        </li>
        <li className="group text-center max-w-[100px]">
          <Link href="/categories/jewel">
            <div className="mb-2 flex items-center justify-center overflow-hidden aspect-square rounded-full bg-zinc-200">
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
    </section>
  );
};

export default CategoryShortcutSection;

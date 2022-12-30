import Image from "next/image";
import Link from "next/link";
import logo from "../public/logos/logo512.svg";
import cartIcon from "../public/icons/cart-nav.svg";
import profileIcon from "../public/icons/profile-nav.svg";
import { Category, CategoryDataType } from "../types";
import categoryData from "../public/json/categoryData.json";

const Nav = () => {
  const categoryNavGenerator = (category: Category, i: number) => {
    return (
      <li key={i}>
        <Link href={`/categories/${category.path}/all`}>
          <h3 className="mb-3 xs:text-base">{category.name}</h3>
        </Link>
        <ul className="text-zinc-500 flex flex-col gap-2 text-sm">
          {category.subCategories?.map((subCategory, i) => (
            <li key={i}>
              <Link href={`/categories/${category.path}/${subCategory.path}`}>
                {subCategory.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <nav>
      <ol className="z-30 w-full min-w-[360px] max-w-[1300px] mx-auto h-16 fixed top-0 left-0 right-0 flex justify-evenly items-center gap-5 p-4 px-10 bg-white border-b font-semibold text-lg text-zinc-800 xs:text-sm">
        <div className="flex grow items-center justify-start gap-10 sm:gap-5">
          <li className="shrink-0 w-24 mx-4 sm:w-20 sm:mx-2 xs:w-16 xs:mx-2">
            <Link href="/">
              <Image src={logo} alt="로고" />
            </Link>
          </li>
          <li>
            <Link
              href="/collection"
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 xs:px-2"
            >
              컬렉션
            </Link>
          </li>
          <li className="group">
            <Link
              href="/categories"
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 xs:px-2"
            >
              카테고리
            </Link>
            <div className="w-full h-0 absolute left-0 top-full bg-white border-zinc-200 overflow-hidden transition-all duration-500 group-hover:h-[220px] group-hover:border-y">
              <ul className="w-full flex justify-evenly mt-4 text-lg">
                {Object.keys(categoryData).map((key, i) =>
                  categoryNavGenerator(
                    (categoryData as CategoryDataType)[key],
                    i
                  )
                )}
              </ul>
            </div>
          </li>
        </div>
        <div className="flex gap-2">
          <li>
            <Link
              href="/profile"
              className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200"
            >
              <Image
                src={profileIcon}
                alt="Profile"
                className="w-6 md:w-6 2xs:w-5"
              />
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 "
            >
              <Image
                src={cartIcon}
                alt="Shopping cart"
                className="w-6 md:w-6 2xs:w-5"
              />
              <span className="w-5 h-5 flex justify-center self-start bg-[firebrick] border border-[firebrick] rounded-full text-white text-xs font-bold">
                9+
              </span>
            </Link>
          </li>
        </div>
      </ol>
    </nav>
  );
};

export default Nav;

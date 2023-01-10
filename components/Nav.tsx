import Image from "next/image";
import Link from "next/link";
import logo from "../public/logos/logo512.svg";
import { Category } from "../types";
import categoryData from "../public/json/categoryData.json";
import cartIcon from "../public/icons/cart-nav.svg";
import profileIcon from "../public/icons/profile-nav.svg";

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
    <nav className="z-30 w-full min-w-[360px] max-w-[1300px] mx-auto h-16 fixed top-0 left-0 right-0 py-4 bg-white border-b font-semibold text-lg text-zinc-800">
      <ol className="flex justify-evenly items-center gap-5 h-full xs:gap-2">
        <div className="flex grow items-center justify-start gap-10 md:gap-5 sm:gap-2">
          <li className="w-24 mx-4 xs:w-20">
            <Link href="/">
              <Image src={logo} alt="로고" />
            </Link>
          </li>
          <li>
            <Link
              href="/collection"
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 2xs:px-2"
            >
              컬렉션
            </Link>
          </li>
          <li className="group">
            <Link
              href="/categories"
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 2xs:px-2"
            >
              카테고리
            </Link>
            <div className="w-full h-0 absolute left-0 top-full bg-white border-zinc-200 overflow-hidden transition-all duration-500 group-hover:h-[220px] group-hover:border-y">
              <ul className="w-full flex justify-evenly mt-4 text-lg">
                {Object.values(categoryData).map((category, i) =>
                  categoryNavGenerator(category as Category, i)
                )}
              </ul>
            </div>
          </li>
        </div>
        <div className="flex gap-2 shrink-0 mr-4">
          <li>
            <Link
              href="/account"
              className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200"
            >
              <Image src={profileIcon} alt="Account" className="w-6" />
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200"
            >
              <Image src={cartIcon} alt="Profile" className="w-6" />
            </Link>
          </li>
        </div>
      </ol>
    </nav>
  );
};

export default Nav;

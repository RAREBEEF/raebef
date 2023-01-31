import Image from "next/image";
import Link from "next/link";
import logo from "../public/logos/logo512.svg";
import logo2 from "../public/logos/logo2.svg";
import { Category } from "../types";
import categoryData from "../public/json/categoryData.json";
import cartIcon from "../public/icons/cart-nav.svg";
import profileIcon from "../public/icons/profile-nav.svg";
import searchIcon from "../public/icons/search-nav.svg";
import { FocusEvent, FormEvent, MouseEvent, useRef, useState } from "react";
import useInput from "../hooks/useInput";
import { useRouter } from "next/router";

const LayoutNav = () => {
  const {
    value: keywords,
    setValue: setKeywords,
    onChange: onKeywordsChange,
  } = useInput("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const { push } = useRouter();

  const categoryNavGenerator = (category: Category, i: number) => {
    return (
      <li key={i}>
        <Link
          href={{
            pathname: `/categories/${category.path}/all`,
            query: { orderby: "popularity" },
          }}
        >
          <h3 className="mb-3 xs:text-base">{category.name}</h3>
        </Link>
        <ul className="text-zinc-500 flex flex-col gap-2 text-sm">
          {category.subCategories?.map((subCategory, i) => (
            <li key={i}>
              <Link
                href={{
                  pathname: `/categories/${category.path}/${subCategory.path}`,
                  query: { orderby: "popularity" },
                }}
              >
                {subCategory.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  const onSearchToggle = (e: MouseEvent<HTMLButtonElement>) => {
    if (!searchInputRef.current) return;

    e.preventDefault();
    setShowSearchInput(true);
    searchInputRef.current.focus();
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    push({
      pathname: "/search",
      query: { keywords, orderby: "popularity" },
    });
    setShowSearchInput(false);
  };

  const onSearchBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    setKeywords("");
    setShowSearchInput(false);
  };

  const onCategoryMouseOver = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();

    setShowSearchInput(false);
  };

  return (
    <nav className="z-30 w-full min-w-[360px] max-w-[1300px] mx-auto h-16 fixed top-0 left-0 right-0 py-4 bg-white border-b font-semibold text-lg text-zinc-800">
      <ol className="flex justify-evenly items-center gap-5 h-full xs:gap-2">
        <div className="flex grow items-center justify-start gap-10 md:gap-5 sm:gap-2">
          <li className="w-24 mx-4 xs:w-12 xs:mx-0 xs:ml-2">
            <Link href="/">
              <Image src={logo} alt="로고" className="xs:hidden" />
              <Image src={logo2} alt="로고" className="hidden h-12 xs:inline" />
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
          <li className="group" onMouseOver={onCategoryMouseOver}>
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
            <form onSubmit={onSearch} className="flex justify-end gap-2">
              <input
                ref={searchInputRef}
                onBlur={onSearchBlur}
                placeholder="제품 검색"
                className={`transition-all duration-500 md:absolute md:top-full md:bg-white md:w-screen md:right-0 md:text-xl md:p-4 ${
                  showSearchInput ? "max-w-full" : "max-w-0 md:px-0"
                }`}
                style={{ borderBottom: "1px solid #e5e7eb" }}
                value={keywords}
                onChange={onKeywordsChange}
              />
              <button
                onClick={showSearchInput ? onSearch : onSearchToggle}
                className={`px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 ${
                  showSearchInput && "opacity-0 pointer-events-none"
                }`}
              >
                <Image src={searchIcon} alt="Search" className="w-6" />
              </button>
            </form>
          </li>
          <li>
            <Link
              href="/account?tab=profile"
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

export default LayoutNav;

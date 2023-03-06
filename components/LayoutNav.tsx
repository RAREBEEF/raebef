import Image from "next/image";
import Link from "next/link";
import logo from "../public/logos/logo512.svg";
import logo2 from "../public/logos/logo2.svg";
import { Category } from "../types";
import categoryData from "../public/json/categoryData.json";
import cartIcon from "../public/icons/cart-nav.svg";
import profileIcon from "../public/icons/profile-nav.svg";
import loginIcon from "../public/icons/login-nav.svg";
import searchIcon from "../public/icons/search-nav.svg";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import useInput from "../hooks/useInput";
import { useRouter } from "next/router";
import useGetUserData from "../hooks/useGetUserData";

const LayoutNav = () => {
  const {
    value: keywords,
    setValue: setKeywords,
    onChange: onKeywordsChange,
  } = useInput("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const { push, query } = useRouter();
  const { data: userData } = useGetUserData();

  const categoryNavGenerator = (category: Category, i: number) => {
    if (category.path === "all") return null;

    return (
      <li key={i}>
        <Link
          href={{
            pathname: `/products/categories/${category.path}${
              category.path !== "all" ? "/all" : ""
            }`,
            query: { orderby: "popularity" },
          }}
        >
          <h3 className="mb-3 xs:text-base">{category.name}</h3>
        </Link>
        <ul className="flex flex-col gap-2 text-sm text-zinc-500">
          {category.subCategories?.map((subCategory, i) => (
            <li key={i}>
              <Link
                href={{
                  pathname: `/products/categories/${category.path}/${subCategory.path}`,
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

    if (!keywords || keywords.trim().length === 0) return;

    push({
      pathname: "/products/search",
      query: { keywords, orderby: "popularity" },
    });

    setShowSearchInput(false);
  };

  // 검색창 외부 클릭 감지
  useEffect(() => {
    const windowClickListener = (e: Event) => {
      const target = e.target as HTMLElement;

      !target.classList.contains("search") && setShowSearchInput(false);
    };

    if (showSearchInput) {
      window.addEventListener("click", windowClickListener);
    } else {
      window.removeEventListener("click", windowClickListener);
    }

    return () => {
      window.removeEventListener("click", windowClickListener);
    };
  }, [showSearchInput]);

  useEffect(() => {
    if (query.keywords) {
      setKeywords(query.keywords as string);
    } else {
      setKeywords("");
    }
  }, [query.keywords, setKeywords]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-auto h-16 w-full min-w-[360px] border-b bg-white px-7 py-4 text-lg font-semibold text-zinc-800">
      <ol className="mx-auto flex h-full max-w-[1700px] items-center justify-evenly gap-5 xs:gap-2">
        <div className="flex grow items-center justify-start gap-10 md:gap-5 sm:gap-2">
          <li className="mx-4 w-24 xs:mx-0 xs:ml-2 xs:w-12">
            <Link href="/">
              <Image src={logo} alt="로고" className="xs:hidden" priority />
              <Image
                src={logo2}
                alt="로고"
                className="hidden h-12 xs:inline"
                priority
              />
            </Link>
          </li>
          <li>
            <Link
              href="/collections"
              className="flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 transition-all hover:bg-zinc-200 2xs:px-2"
            >
              컬렉션
            </Link>
          </li>
          <li className="btn--category">
            <Link
              href="/products/categories/all"
              className="flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 transition-all hover:bg-zinc-200 2xs:px-2"
            >
              카테고리
            </Link>
            <div className="category__dropdown absolute left-0 top-full h-0 w-full overflow-hidden border-zinc-200 bg-white transition-all duration-500">
              <ul className="relative z-50 mt-4 flex w-full justify-evenly bg-white text-lg">
                {Object.values(categoryData).map((category, i) =>
                  categoryNavGenerator(category as Category, i)
                )}
              </ul>
            </div>
          </li>
        </div>
        <div className="flex shrink-0 gap-2">
          <li className="search">
            <form onSubmit={onSearch} className="search flex justify-end gap-2">
              <input
                type="search"
                ref={searchInputRef}
                placeholder="제품 검색"
                className={`search z-40 transition-all duration-500 md:absolute md:top-full md:right-0 md:w-screen md:bg-white md:p-4 md:text-xl ${
                  showSearchInput ? "max-w-full" : "max-w-0 md:px-0"
                }`}
                style={{ borderBottom: "1px solid #e5e7eb" }}
                value={keywords}
                onChange={onKeywordsChange}
              />
              <button
                onClick={showSearchInput ? onSearch : onSearchToggle}
                className={`search flex items-center justify-center gap-1 whitespace-nowrap rounded-md px-1 py-1 transition-all hover:bg-zinc-200 ${
                  showSearchInput && false && "pointer-events-none opacity-0"
                }`}
              >
                <Image src={searchIcon} alt="Search" className="search w-6" />
              </button>
            </form>
          </li>
          <li>
            <Link
              href={userData ? "/account?tab=profile" : "/login"}
              className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md px-1 py-1 transition-all hover:bg-zinc-200"
            >
              <Image
                src={userData ? profileIcon : loginIcon}
                alt={userData ? "Account" : "Login"}
                className="w-6"
              />
            </Link>
          </li>
          {userData && (
            <li className="relative">
              <Link
                href="/cart"
                className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md px-1 py-1 transition-all hover:bg-zinc-200"
              >
                <Image src={cartIcon} alt="Profile" className="w-6" />
                <span className="absolute top-[-20%] right-[-30%] flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-red-700 text-xs text-white">
                  {Object.keys(userData.cart || {}).length >= 10
                    ? "9+"
                    : Object.keys(userData.cart || {}).length}
                </span>
              </Link>
            </li>
          )}
        </div>
      </ol>
      <style jsx>{`
        @media (hover: hover) {
          .btn--category:hover {
            .category__dropdown {
              height: 220px;
              border-top: 1px solid rgba(39, 39, 42, 0.1);
              border-bottom: 1px solid rgba(39, 39, 42, 0.1);
            }
          }
        }
      `}</style>
    </nav>
  );
};

export default LayoutNav;

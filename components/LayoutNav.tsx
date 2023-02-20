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
import {
  FocusEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
        <ul className="text-zinc-500 flex flex-col gap-2 text-sm">
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
    <nav className="z-50 w-full min-w-[360px] max-w-[1700px] mx-auto h-16 px-5 fixed top-0 left-0 right-0 py-4 bg-white border-b font-semibold text-lg text-zinc-800">
      <ol className="flex justify-evenly items-center gap-5 h-full xs:gap-2">
        <div className="flex grow items-center justify-start gap-10 md:gap-5 sm:gap-2">
          <li className="w-24 mx-4 xs:w-12 xs:mx-0 xs:ml-2">
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
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 2xs:px-2"
            >
              컬렉션
            </Link>
          </li>
          <li className="group">
            <Link
              href="/products/categories/all"
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 2xs:px-2"
            >
              카테고리
            </Link>
            <div className="w-full h-0 absolute left-0 top-full bg-white border-zinc-200 overflow-hidden transition-all duration-500 group-hover:h-[220px] xs:group-hover:h-0 group-hover:border-y">
              <ul className="relative bg-white w-full z-50 flex justify-evenly mt-4 text-lg">
                {Object.values(categoryData).map((category, i) =>
                  categoryNavGenerator(category as Category, i)
                )}
              </ul>
            </div>
          </li>
        </div>
        <div className="flex gap-2 shrink-0 mr-4">
          <li className="search">
            <form onSubmit={onSearch} className="search flex justify-end gap-2">
              <input
                type="search"
                ref={searchInputRef}
                placeholder="제품 검색"
                className={`search transition-all z-40 duration-500 md:absolute md:top-full md:bg-white md:w-screen md:right-0 md:text-xl md:p-4 ${
                  showSearchInput ? "max-w-full" : "max-w-0 md:px-0"
                }`}
                style={{ borderBottom: "1px solid #e5e7eb" }}
                value={keywords}
                onChange={onKeywordsChange}
              />
              <button
                onClick={showSearchInput ? onSearch : onSearchToggle}
                className={`search px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 ${
                  showSearchInput && false && "opacity-0 pointer-events-none"
                }`}
              >
                <Image src={searchIcon} alt="Search" className="search w-6" />
              </button>
            </form>
          </li>
          <li>
            <Link
              href={userData ? "/account?tab=profile" : "/login"}
              className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200"
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
                className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200"
              >
                <Image src={cartIcon} alt="Profile" className="w-6" />
                <span className="absolute top-[-20%] right-[-30%] flex justify-center items-center text-xs rounded-full text-white bg-red-700 aspect-square w-5 h-5">
                  {Object.keys(userData.cart || {}).length >= 10
                    ? "9+"
                    : Object.keys(userData.cart || {}).length}
                </span>
              </Link>
            </li>
          )}
        </div>
      </ol>
    </nav>
  );
};

export default LayoutNav;

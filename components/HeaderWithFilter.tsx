import { useRouter } from "next/router";
import categoryData from "../public/json/categoryData.json";
import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from "react";
import {
  CategoryName,
  ColorType,
  FilterCheckbox,
  FilterNameType,
  FilterType,
  GenderType,
  OrderType,
  SizeType,
} from "../types";
import Button from "./Button";
import Link from "next/link";

interface Props {
  productsLength: number;
  filter: FilterType;
}

const HeaderWithFilter: React.FC<Props> = ({
  productsLength,
  filter: appliedFilter,
}) => {
  const { push, query } = useRouter();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [checkedFilter, setCheckedFilter] = useState<FilterType>({
    ...appliedFilter,
  });

  // 적용된 필터로 보여질 필터 처리
  useEffect(() => {
    setCheckedFilter((prev) => ({ ...prev, ...appliedFilter }));
  }, [appliedFilter]);

  // 카테고리 변경
  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value as CategoryName;

    setCheckedFilter((prev) => ({
      ...prev,
      category: value,
    }));

    push(
      {
        query: {
          ...query,
          categories: [value, value === "all" ? "" : "all"],
        },
      },
      undefined,
      { scroll: false }
    );
  };

  // 정렬 기준 변경
  const onOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value as OrderType;

    setCheckedFilter((prev) => ({ ...prev, orderby: value }));

    push(
      {
        query: { ...query, orderby: value },
      },
      undefined,
      { scroll: false }
    );
  };

  // 개별 체크박스 클릭
  const onCheckboxChange = (
    name: FilterNameType,
    value: GenderType & SizeType & ColorType
  ) => {
    const newFilter: FilterType = { ...checkedFilter };
    if (name === "gender") {
      newFilter.gender = value;
    } else if (name === "color") {
      newFilter.color = value;
    } else if (!newFilter.size.includes(value)) {
      newFilter.size.push(value);
    } else {
      newFilter.size.splice(newFilter.size.indexOf(value), 1);
    }

    setCheckedFilter(newFilter);
  };

  // 전체 선택 체크박스 클릭
  const onAllCheckboxToggle = (name: FilterNameType) => {
    const newFilter: FilterType = { ...checkedFilter };

    if (name === "gender") {
      newFilter.gender = "all";
    } else if (name === "color") {
      newFilter.color = "";
    } else if (newFilter.size.length === filterData.size.length) {
      newFilter.size = [];
    } else {
      newFilter.size = filterData.size.map(
        (filter) => filter.value
      ) as Array<SizeType>;
    }

    setCheckedFilter(newFilter);
  };

  // 체크박스 생성
  const checkboxGenerator = (
    list: Array<FilterCheckbox>,
    name: FilterNameType
  ) => {
    const checkboxes: Array<ReactNode> = [
      <li key={-1}>
        <label className="w-fit flex gap-1 items-center">
          <input
            name={name}
            type={name === "size" ? "checkbox" : "radio"}
            value="all"
            onChange={() => {
              onAllCheckboxToggle(name);
            }}
            checked={
              name === "size"
                ? checkedFilter.size.length === filterData.size.length
                : name === "gender"
                ? checkedFilter.gender === "all"
                : checkedFilter[name].length === 0
            }
          />
          전체
        </label>
      </li>,
    ];

    checkboxes.push(
      ...list.map((data, i) => (
        <li key={i}>
          <label className="w-fit flex gap-1 items-center">
            <input
              name={name}
              type={name === "size" ? "checkbox" : "radio"}
              value={data.value}
              onChange={() => {
                onCheckboxChange(
                  name,
                  data.value as GenderType & ColorType & SizeType
                );
              }}
              checked={
                name === "size"
                  ? checkedFilter[name].includes(data.value)
                  : checkedFilter[name] === data.value
              }
            />
            {data.children}
            {data.text}
          </label>
        </li>
      ))
    );

    return checkboxes;
  };

  // 하위 카테고리 버튼 생성
  const subCategoryGenerator = (categories: Array<string>) => {
    if (!categories) return;

    let [category, subCategory] = categories as [CategoryName, string];

    const subCategories: Array<ReactNode> = [
      <li
        key={-1}
        className={`px-1 transition-all
          ${
            (!subCategory || subCategory === "all") &&
            "font-bold bg-zinc-800 text-zinc-50"
          }`}
      >
        <Link
          href={{
            pathname: `/products/categories/${category}${
              category === "all" ? "" : "/all"
            }`,
            query: { orderby: "popularity" },
          }}
        >
          전체
        </Link>
      </li>,
    ];

    categoryData[category]?.subCategories.forEach((cur, i) => {
      subCategories.push(
        <li
          key={i}
          className={`px-1 transition-all
        ${subCategory === cur.path && "font-bold bg-zinc-800 text-zinc-50"}`}
        >
          <Link
            href={{
              pathname: `/products/categories/${category}/${cur.path}`,
              query: { orderby: "popularity" },
            }}
          >
            {cur.name}
          </Link>
        </li>
      );
    });

    return subCategories;
  };

  // 필터 적용
  const onFilterApply = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { gender, size, color } = checkedFilter;

    const filterQuery = {
      gender: gender || "all",
      size:
        size.length === 0 || size.length === filterData.size.length
          ? "all"
          : size.join(" "),
      color: color || "all",
    };

    push(
      {
        query: { ...query, ...filterQuery },
      },
      undefined,
      { scroll: false }
    );
  };

  // 필터 초기화
  const onFilterReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    push({
      query: {
        ...query,
        gender: "all",
        size: "all",
        color: "all",
      },
    });

    setCheckedFilter((prev) => ({
      ...prev,
      gender: "all",
      size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl", "default"],
      color: "",
    }));
  };

  // 필터 탭 펼치기
  const onFilterToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilterOpen((prev) => !prev);
  };

  return (
    <div className="bg-white relative border-b text-zinc-800 mb-12">
      <section className="relative px-12 py-5 flex justify-between font-bold md:pb-3 xs:px-5">
        <header className="text-3xl font-bold md:text-2xl xs:text-xl">
          <hgroup>
            <h2 className="text-lg text-zinc-500 md:text-base xs:text-sm">
              {appliedFilter.keywords && appliedFilter.keywords.length !== 0
                ? "제품 검색"
                : "카테고리"}
            </h2>
            <h1 className="group relative flex items-center gap-3">
              {checkedFilter.keywords && checkedFilter.keywords.length !== 0 ? (
                checkedFilter.keywords
              ) : (
                <div className="flex items-center gap-2">
                  <span>
                    {categoryData[checkedFilter.category as CategoryName]?.name}{" "}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    className="stroke-zinc-500 w-[20px] my-auto transition-transform duration-500 group-hover:translate-x-[5px]"
                    style={{
                      rotate: "90deg",
                      fill: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "50px",
                    }}
                  >
                    <polyline points="78.79 267.02 222.75 150 78.79 32.98" />
                  </svg>

                  <select
                    className="absolute text-lg left-0 w-full cursor-pointer opacity-0 h-9"
                    onChange={onCategoryChange}
                    value={checkedFilter.category}
                  >
                    <option value="all">전체</option>
                    <option value="clothes">의류</option>
                    <option value="accessory">악세서리</option>
                    <option value="shoes">신발</option>
                    <option value="bag">가방</option>
                    <option value="jewel">주얼리</option>
                  </select>
                </div>
              )}
              <p className="text-sm font-medium text-zinc-600 xs:text-xs">
                {productsLength} 제품
              </p>
            </h1>
          </hgroup>
        </header>
        <div className="flex gap-5 mt-7">
          <select
            className="cursor-pointer text-sm text-right"
            onChange={onOrderChange}
            value={checkedFilter.orderby}
          >
            <option value="" disabled>
              정렬 기준
            </option>
            <option value="popularity">인기순</option>
            <option value="date">신상품</option>
            <option value="priceDes">가격 높은 순</option>
            <option value="priceAsc">가격 낮은 순</option>
          </select>
          {(!appliedFilter.keywords || appliedFilter.keywords.length === 0) && (
            <button
              onClick={onFilterToggle}
              className={`transition-all duration-500 ${
                filterOpen && "text-zinc-400"
              }`}
            >
              필터
            </button>
          )}
        </div>
      </section>
      {(!appliedFilter.keywords || appliedFilter.keywords?.length === 0) && (
        <nav className="px-12 pb-5 text-lg md:text-base xs:px-5">
          <ul className="flex gap-5 flex-wrap 2xs:gap-3">
            {subCategoryGenerator(query.categories as Array<string>)}
          </ul>
        </nav>
      )}
      {(!appliedFilter.keywords || appliedFilter.keywords.length === 0) && (
        <section
          className={`w-full h-0 overflow-hidden font-semibold text-zinc-500 transition-all duration-500 ${
            filterOpen ? "h-[460px] p-5 border-t" : "h-0 mb-0"
          }`}
        >
          <section className="flex justify-evenly">
            <div>
              <h4 className="mb-3 text-lg text-zinc-800">성별</h4>
              <ul className="flex flex-col gap-2">
                {checkboxGenerator(
                  filterData.gender as GenderType & ColorType & SizeType,
                  "gender"
                )}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-lg text-zinc-800">사이즈</h4>
              <ul className="flex flex-col gap-2">
                {checkboxGenerator(
                  filterData.size as GenderType & ColorType & SizeType,
                  "size"
                )}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-lg text-zinc-800">색상</h4>
              <ul className="flex flex-col gap-2">
                {checkboxGenerator(
                  filterData.color as GenderType & ColorType & SizeType,
                  "color"
                )}
              </ul>
            </div>
          </section>
          <section className="px-5 pt-10 flex gap-2 justify-end">
            <Button onClick={onFilterApply} theme="black">
              적용
            </Button>
            <Button
              onClick={onFilterReset}
              tailwindStyles="bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-300"
            >
              초기화
            </Button>
            <Button
              onClick={onFilterToggle}
              tailwindStyles="bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-300"
            >
              닫기
            </Button>
          </section>
        </section>
      )}
    </div>
  );
};

export default HeaderWithFilter;

export const filterData: {
  gender: {
    value: GenderType | ColorType | SizeType;
    text: string;
  }[];
  size: {
    value: GenderType | ColorType | SizeType;
    text: string;
  }[];
  color: {
    value: GenderType | ColorType | SizeType;
    text: string;
    children: JSX.Element;
  }[];
} = {
  gender: [
    { value: "male", text: "남성" },
    { value: "female", text: "여성" },
  ],
  size: [
    { value: "xs", text: "XS" },
    { value: "s", text: "S" },
    { value: "m", text: "M" },
    { value: "l", text: "L" },
    { value: "xl", text: "XL" },
    { value: "xxl", text: "XXL" },
    { value: "xxxl", text: "XXXL" },
    { value: "default", text: "기타" },
  ],
  color: [
    {
      value: "black",
      text: "블랙",
      children: <span className="w-3 h-3 bg-[black] rounded-full" />,
    },
    {
      value: "white",
      text: "화이트",
      children: <span className="w-3 h-3 bg-[white] border rounded-full" />,
    },
    {
      value: "gray",
      text: "그레이",
      children: <span className="w-3 h-3 bg-[gray] rounded-full" />,
    },
    {
      value: "red",
      text: "레드",
      children: <span className="w-3 h-3 bg-[red] rounded-full" />,
    },
    {
      value: "orange",
      text: "오렌지",
      children: <span className="w-3 h-3 bg-[orange] rounded-full" />,
    },
    {
      value: "brown",
      text: "브라운",
      children: <span className="w-3 h-3 bg-[brown] rounded-full" />,
    },
    {
      value: "beige",
      text: "베이지",
      children: <span className="w-3 h-3 bg-[#e5c899] rounded-full" />,
    },
    {
      value: "blue",
      text: "블루",
      children: <span className="w-3 h-3 bg-[blue] rounded-full" />,
    },
    {
      value: "skyblue",
      text: "스카이블루",
      children: <span className="w-3 h-3 bg-[skyblue] rounded-full" />,
    },
    {
      value: "green",
      text: "그린",
      children: <span className="w-3 h-3 bg-[green] rounded-full" />,
    },
  ],
};

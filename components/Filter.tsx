import { useRouter } from "next/router";
import categoryData from "../public/json/categoryData.json";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
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
  setFilter: Dispatch<React.SetStateAction<FilterType>>;
  filter: FilterType;
}

const Filter: React.FC<Props> = ({
  productsLength,
  setFilter: setAppliedFilter,
  filter: appliedFilter,
}) => {
  const {
    query: { categories },
  } = useRouter();
  const [categoryHeader, setCategoryHeader] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [checkedFilter, setCheckedFilter] = useState<FilterType>({
    ...appliedFilter,
  });

  // 카테고리 데이터 처리
  useEffect(() => {
    if (!categories || typeof categories === "string") return;

    // 카테고리 헤더 처리
    const key = categories[0] as CategoryName;
    const header = categoryData[key].name;

    setCategoryHeader(header);

    // 카테고리 필터 처리
    if (!categories) {
      return;
    } else if (typeof categories === "string") {
      setAppliedFilter((prev) => ({
        ...prev,
        category: categories,
        subCategory: "",
      }));
      setCheckedFilter((prev) => ({
        ...prev,
        category: categories,
        subCategory: "",
      }));
    } else if (categories.length === 1) {
      setAppliedFilter((prev) => ({
        ...prev,
        category: key,
        subCategory: "",
      }));
      setCheckedFilter((prev) => ({
        ...prev,
        category: key,
        subCategory: "",
      }));
    } else {
      setAppliedFilter((prev) => ({
        ...prev,
        category: key,
        subCategory: categories[1],
      }));
      setCheckedFilter((prev) => ({
        ...prev,
        category: key,
        subCategory: categories[1],
      }));
    }
  }, [categories, setAppliedFilter]);

  // 정렬 기준 변경
  const onOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value as OrderType;

    setCheckedFilter((prev) => ({ ...prev, order: value }));
    setAppliedFilter((prev) => ({ ...prev, order: value }));
  };

  // 필터 탭 펼치기
  const onFilterToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilterOpen((prev) => !prev);
  };

  // 개별 체크박스 클릭
  const onCheckboxChange = (
    name: FilterNameType,
    value: GenderType & SizeType & ColorType
  ) => {
    const newFilter: FilterType = { ...checkedFilter };
    if (name !== "size") {
      newFilter[name] = value;
    } else if (!newFilter[name].includes(value)) {
      newFilter[name].push(value);
    } else {
      newFilter[name].splice(newFilter[name].indexOf(value), 1);
    }

    setCheckedFilter(newFilter);
  };

  // 전체 선택 체크박스 클릭
  const onAllCheckboxToggle = (name: FilterNameType) => {
    const newFilter: FilterType = { ...checkedFilter };

    if (name !== "size") {
      newFilter[name] = "";
    } else if (newFilter[name].length === filterData[name].length) {
      newFilter[name] = [];
    } else {
      newFilter[name] = filterData[name].map(
        (filter) => filter.value
      ) as Array<GenderType> & Array<SizeType> & Array<ColorType>;
    }

    setCheckedFilter(newFilter);
  };

  // 필터 적용
  const onFilterApply = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAppliedFilter((prev) => ({ ...checkedFilter }));
  };

  // 필터 초기화
  const onFilterReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setAppliedFilter((prev) => ({
      ...prev,
      gender: "",
      size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
      color: "",
      order: "orderCount",
    }));

    setCheckedFilter((prev) => ({
      ...prev,
      gender: "",
      size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
      color: "",
      order: "orderCount",
    }));
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
                ? checkedFilter[name].length === filterData[name].length
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
  const subCategoryGenerator = () => {
    if (!categoryData || !categories) return;

    const key = categories[0] as CategoryName;

    const subCategories: Array<ReactNode> = [
      <li
        key={-1}
        className={`px-1
          ${categories.length === 1 && "font-bold bg-zinc-800 text-zinc-50"}`}
      >
        <Link href={`/categories/${key}`}>전체</Link>
      </li>,
    ];

    subCategories.push(
      ...categoryData[key].subCategories.map((subCategory, i) => (
        <li
          key={i}
          className={`px-1
          ${
            categories[1] === subCategory.path &&
            "font-bold bg-zinc-800 text-zinc-50"
          }`}
        >
          <Link href={`/categories/${key}/${subCategory.path}`}>
            {subCategory.name}
          </Link>
        </li>
      ))
    );

    return subCategories;
  };

  return (
    <div className="border-b text-zinc-800">
      <section className="relative px-12 py-5 flex justify-between font-bold sm:flex-col sm:items-center">
        <header className="text-3xl font-bold sm:mb-3">
          <hgroup className="sm:text-center">
            <h1 className="text-lg text-zinc-500">
              <Link href="/categories">카테고리</Link>
            </h1>
            <h2 className="flex items-center gap-3 sm:flex-col sm:gap-3">
              {categoryHeader}
              <p className="text-sm font-medium text-zinc-600">
                {productsLength} 제품
              </p>
            </h2>
          </hgroup>
        </header>
        <div className="flex gap-5 sm:w-full sm:justify-end">
          <select
            className="cursor-pointer text-sm text-right"
            defaultValue={"orderCount"}
            onChange={onOrderChange}
          >
            <option value="" disabled>
              정렬 기준
            </option>
            <option value="orderCount">인기순</option>
            <option value="date">신상품</option>
            <option value="priceDes">가격 높은 순</option>
            <option value="priceAsc">가격 낮은 순</option>
          </select>
          <button
            onClick={onFilterToggle}
            className={`transition-all duration-500 ${
              filterOpen && "text-zinc-400"
            }`}
          >
            필터
          </button>
        </div>
      </section>
      <section className="px-12 pb-5 text-lg">
        <ul className="flex gap-5 flex-wrap">{subCategoryGenerator()}</ul>
      </section>
      <section
        className={`w-full h-0 overflow-hidden font-semibold text-zinc-500 transition-all duration-500 ${
          filterOpen ? "h-[440px] p-5 border-t" : "h-0 mb-0"
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
          <Button onClick={onFilterApply}>적용</Button>
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
    </div>
  );
};

export default Filter;

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

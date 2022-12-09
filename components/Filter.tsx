import { ChangeEvent, Dispatch, MouseEvent, ReactNode, useState } from "react";
import {
  ColorType,
  FilterCheckbox,
  FilterNameType,
  FilterType,
  GenderType,
  OrderType,
  SizeType,
} from "../types";
import Button from "./Button";

interface Props {
  header: string;
  productsLength: number;
  setFilter: Dispatch<React.SetStateAction<FilterType>>;
  filter: FilterType;
}

const Filter: React.FC<Props> = ({
  header,
  productsLength,
  setFilter: setAppliedfilter,
  filter: appliedFilter,
}) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [checkedFilter, setCheckedFilter] = useState<FilterType>({
    ...appliedFilter,
  });

  const onOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value as OrderType;

    const newFilter = { ...checkedFilter, order: value };

    setCheckedFilter(newFilter);
    setAppliedfilter(newFilter);
  };

  // 필터 펼치기
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
    setAppliedfilter(checkedFilter);
  };

  // 필터 초기화
  const onFilterReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setAppliedfilter({
      gender: "",
      size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
      color: "",
      order: "orderCount",
    });
    setCheckedFilter({
      gender: "",
      size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
      color: "",
      order: "orderCount",
    });
  };

  // 체크박스 생성기
  const checkboxGenerator = (
    list: Array<FilterCheckbox>,
    name: FilterNameType
  ) => {
    const checkboxes: Array<ReactNode> = [];

    checkboxes.push(
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
      </li>
    );

    list.forEach((data, i) => {
      checkboxes.push(
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
      );
    });

    return checkboxes;
  };

  return (
    <div className="border-b text-zinc-800">
      <div className="px-10 py-5 flex justify-between font-bold sm:flex-col sm:items-center xs:gap-3">
        <header className="flex items-center gap-5 text-xl font-bold sm:flex-col sm:items-center sm:gap-3">
          <h1>{header}</h1>
          <p className="text-sm font-medium text-zinc-600">
            {productsLength} 제품
          </p>
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
      </div>
      <div
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
      </div>
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

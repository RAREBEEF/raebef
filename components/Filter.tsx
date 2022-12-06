import { FormEvent, MouseEvent, ReactNode, useState } from "react";
import { FilterType } from "../types";
import Button from "./Button";

interface FilterCheckbox {
  value: string;
  text: string;
  children?: ReactNode;
}

interface Props {
  header: string;
  productsLength: number;
}

const Filter: React.FC<Props> = ({ header, productsLength }) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>({
    gender: [],
    size: [],
    color: [],
  });

  const onFilterToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilterOpen((prev) => !prev);
  };

  const onCheckboxChange = (
    name: "gender" | "size" | "color",
    value: string
  ) => {
    const newFilter: FilterType = { ...filter };
    // @ts-ignored
    if (!newFilter[name].includes(value)) {
      // @ts-ignored
      newFilter[name].push(value);
    } else {
      // @ts-ignored
      newFilter[name].splice(newFilter[name].indexOf(value), 1);
    }

    setFilter(newFilter);
  };

  const onAllCheckboxToggle = (name: "gender" | "size" | "color") => {
    const newFilter: FilterType = { ...filter };

    if (newFilter[name].length === filterData[name].length) {
      newFilter[name] = [];
    } else {
      // @ts-ignored
      newFilter[name] = filterData[name].map((filter) => filter.value);
    }

    setFilter(newFilter);
  };

  const onFilterApply = (e: FormEvent) => {
    e.preventDefault();
    console.log(filter);
  };

  const onFilterReset = (e: MouseEvent<HTMLButtonElement>) => {
    setFilter({
      gender: [],
      size: [],
      color: [],
    });
  };

  const checkboxGenerator = (
    list: Array<FilterCheckbox>,
    name: "gender" | "size" | "color"
  ) => {
    const checkboxes: Array<ReactNode> = [
      <li key={-1}>
        <label className="w-fit flex gap-1 items-center">
          <input
            name={name}
            type="checkbox"
            value="all"
            onChange={() => {
              onAllCheckboxToggle(name);
            }}
            checked={filter[name].length === filterData[name].length}
          />
          전체
        </label>
      </li>,
    ];

    list.forEach((data, i) => {
      checkboxes.push(
        <li key={i}>
          <label className="w-fit flex gap-1 items-center">
            <input
              name={name}
              type="checkbox"
              value={data.value}
              onChange={() => {
                onCheckboxChange(name, data.value);
              }}
              // @ts-ignored
              checked={filter[name].includes(data.value)}
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
            defaultValue={"popular"}
          >
            <option value="" disabled>
              정렬 기준
            </option>
            <option value="popular">인기순</option>
            <option value="date">신상품</option>
            <option value="priceAsc">가격 높은 순</option>
            <option value="priceDes">가격 낮은 순</option>
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
      <form
        className={`w-full h-0 overflow-hidden font-semibold text-zinc-500 transition-all duration-500 ${
          filterOpen ? "h-[400px] p-5 border-t" : "h-0 mb-0"
        }`}
        onSubmit={onFilterApply}
      >
        <section className="flex justify-evenly">
          <div>
            <h4 className="mb-3 text-lg text-zinc-800">성별</h4>
            <ul className="flex flex-col gap-2">
              {checkboxGenerator(filterData.gender, "gender")}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-zinc-800">사이즈</h4>
            <ul className="flex flex-col gap-2">
              {checkboxGenerator(filterData.size, "size")}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-lg text-zinc-800">색상</h4>
            <ul className="flex flex-col gap-2">
              {checkboxGenerator(filterData.color, "color")}
            </ul>
          </div>
        </section>
        <section className="px-5 pt-10 flex gap-2 justify-end">
          <Button>적용</Button>
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
      </form>
    </div>
  );
};

export default Filter;

const filterData = {
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

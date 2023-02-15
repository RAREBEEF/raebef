import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import { OrderType } from "../types";

interface Props {
  productsLength: number;
  keyword: string;
}

const HeaderWithKeyword: React.FC<Props> = ({ productsLength, keyword }) => {
  const { push, query } = useRouter();

  // 정렬 기준 변경
  const onOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const value = e.target.value as OrderType;

    push(
      {
        query: { ...query, orderby: value },
      },
      undefined,
      { scroll: false }
    );
  };

  return (
    <div className="bg-white relative border-b text-zinc-800 mb-12">
      <section className="relative px-12 py-5 flex justify-between font-bold xs:px-5">
        <header className="text-3xl font-bold md:text-2xl xs:text-xl">
          <hgroup>
            <h1 className="text-lg text-zinc-500 md:text-base xs:text-sm">
              제품 검색
            </h1>
            <h2 className="flex items-center gap-3 ">
              {keyword}
              <p className="text-sm font-medium text-zinc-600 xs:text-xs">
                {productsLength} 제품
              </p>
            </h2>
          </hgroup>
        </header>
        <div className="flex gap-5 mt-7">
          <select
            className="cursor-pointer text-sm text-right"
            onChange={onOrderChange}
          >
            <option value="" disabled>
              정렬 기준
            </option>
            <option value="popularity">인기순</option>
            <option value="date">신상품</option>
            <option value="priceDes">가격 높은 순</option>
            <option value="priceAsc">가격 낮은 순</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default HeaderWithKeyword;

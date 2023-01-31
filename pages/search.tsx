import React, { MouseEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import { FilterType, OrderType, ProductType } from "../types";
import useGetProductsByFilter from "../hooks/useGetProductsByFilter";
import { DocumentData } from "firebase/firestore";
import useGetProductsCount from "../hooks/useGetProductsCount";
import ProductList from "../components/ProductList";
import { useRouter } from "next/router";
import HeaderWithFilter from "../components/HeaderWithFilter";

const Search = () => {
  const { query } = useRouter();
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [filter, setFilter] = useState<FilterType>({
    category: "",
    subCategory: "",
    gender: "all",
    size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
    color: "",
    order: "popularity",
    keywords: (query.keywords as string)?.split(" ") || [],
  });

  // 상품 목록 쿼리
  const {
    data: productsData,
    isFetching,
    isError,
    fetchNextPage,
  } = useGetProductsByFilter(filter);

  // 총 상품 수 쿼리
  const { data: totalCountData } = useGetProductsCount(filter);

  // 불러온 상품 데이터를 상태로 저장
  useEffect(() => {
    let productList: Array<ProductType> = [];

    productsData?.pages.forEach(
      (page: {
        products: Array<ProductType>;
        lastVisible: DocumentData | null;
      }) =>
        page?.products.forEach((product: ProductType) => {
          productList.push(product);
        })
    );

    setProducts(productList);
  }, [productsData]);

  // 더 보기 버튼
  const onLoadMore = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchNextPage();
  };

  useEffect(() => {
    const { orderby, keywords } = query;

    if (!keywords) return;

    const newFilter: FilterType = {
      category: "",
      subCategory: "",
      gender: "all",
      size: [],
      color: "",
      order: (orderby as OrderType) || "popularity",
      keywords: (keywords as string).split(" "),
    };

    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, [query]);

  return (
    <main className="page-container min-h-[50vh] flex flex-col">
      <HeaderWithFilter filter={filter} productsLength={totalCountData || 0} />
      {!isError ? (
        <React.Fragment>
          <ProductList products={products} isFetching={isFetching} />
          {!isFetching && products.length < 1 && (
            <p className="w-full flex grow items-center justify-center text-center text-zinc-600 text-lg font-semibold break-keep">
              해당하는 제품이 존재하지 않습니다.
            </p>
          )}
          {!isFetching &&
          totalCountData &&
          Object.keys(products).length < totalCountData ? (
            <div className="mx-auto text-center mt-10">
              <Button tailwindStyles="w-[200px]" onClick={onLoadMore}>
                더 보기
              </Button>
            </div>
          ) : null}
        </React.Fragment>
      ) : (
        <p className="w-full flex grow items-center justify-center text-center text-zinc-600 text-lg font-semibold break-keep">
          제품 목록을 가져오는 과정에서 문제가 발생하였습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      )}
    </main>
  );
};

export default Search;

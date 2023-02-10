import React, { MouseEvent, useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import { FilterType, OrderType, ProductType } from "../../types";
import useGetProductsByFilter from "../../hooks/useGetProductsByFilter";
import { DocumentData } from "firebase/firestore";
import ProductList from "../../components/ProductList";
import { useRouter } from "next/router";
import HeaderWithFilter from "../../components/HeaderWithFilter";
import Seo from "../../components/Seo";

const Search = () => {
  const { query } = useRouter();
  const observeTargetRef = useRef<HTMLDivElement>(null);
  const [startInfinityScroll, setStartInfinityScroll] =
    useState<boolean>(false);
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [filter, setFilter] = useState<FilterType>({
    category: "",
    subCategory: "",
    gender: "all",
    size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
    color: "",
    order: "popularity",
    keywords: (query.keywords as string) || "",
  });
  // 상품 목록 쿼리
  const {
    data: { data: productsData, isFetching, isError, fetchNextPage },
    count: { data: totalCountData },
  } = useGetProductsByFilter(filter);

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
      keywords: keywords as string,
    };

    setStartInfinityScroll(false);
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, [query]);

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

  // 더 보기 버튼 클릭
  const onLoadMoreClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStartInfinityScroll(true);
    fetchNextPage();
  };

  // 인피니티 스크롤 옵저버 생성
  useEffect(() => {
    if (!startInfinityScroll || !observeTargetRef.current) return;

    const getNextPage = () => {
      if (isFetching) return;
      fetchNextPage();
    };

    const scrollTrigger = new IntersectionObserver(
      (entries) => {
        entries[0].isIntersecting && getNextPage();
      },
      { threshold: 1 }
    );

    scrollTrigger.observe(observeTargetRef.current);
  }, [
    fetchNextPage,
    startInfinityScroll,
    observeTargetRef,
    isFetching,
    query.page,
    query.categories,
  ]);

  return (
    <main className="page-container min-h-[50vh] flex flex-col">
      <Seo title="SEARCH" />
      <HeaderWithFilter filter={filter} productsLength={totalCountData || 0} />
      {!isError ? (
        <React.Fragment>
          {!isFetching &&
          (filter.category || filter.keywords?.length !== 0) &&
          totalCountData === 0 ? (
            <p className="w-full flex grow items-center justify-center text-center text-zinc-600 text-lg font-semibold break-keep">
              해당하는 제품이 존재하지 않습니다.
            </p>
          ) : (
            <ProductList products={products} isFetching={isFetching} />
          )}
          {!isFetching &&
          totalCountData &&
          Object.keys(products).length < totalCountData ? (
            <div className="mx-auto text-center mt-10">
              {startInfinityScroll ? (
                <div
                  ref={observeTargetRef}
                  className="w-screen opacity-0 h-56 pointer-events-none"
                >
                  Loading...
                </div>
              ) : (
                <Button tailwindStyles="w-[200px]" onClick={onLoadMoreClick}>
                  더 보기
                </Button>
              )}
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

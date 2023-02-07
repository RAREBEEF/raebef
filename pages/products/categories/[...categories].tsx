import React, { MouseEvent, useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import {
  CategoryName,
  ColorType,
  FilterType,
  GenderType,
  OrderType,
  ProductType,
  SizeType,
} from "../../../types";
import useGetProductsByFilter from "../../../hooks/useGetProductsByFilter";
import { DocumentData } from "firebase/firestore";
import HeaderWithFilter from "../../../components/HeaderWithFilter";
import ProductList from "../../../components/ProductList";
import { useRouter } from "next/router";
import Head from "next/head";

const Categories = () => {
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
    keywords: [],
  });
  const {
    data: { data: productsData, isFetching, isError, fetchNextPage },
    count: { data: totalCountData },
  } = useGetProductsByFilter(filter);

  // 쿼리스트링 체크 후 필터 적용
  useEffect(() => {
    const { gender, size, color, orderby, categories } = query;

    if (!categories) {
      return;
    }

    let [category, subCategory] = categories as Array<string>;

    if (category !== "all" && !subCategory) {
      return;
    }

    const newFilter: FilterType = {
      category: category as CategoryName,
      subCategory: subCategory as string,
      gender: (gender as GenderType) || "all",
      size:
        !size || size === "all" || typeof size !== "string"
          ? ["xs", "s", "m", "l", "xl", "xxl", "xxxl"]
          : (size.split(" ") as Array<SizeType>),
      color:
        !color || color === "all" || typeof color !== "string"
          ? ""
          : (color as ColorType),
      order: (orderby as OrderType) || "popularity",
    };

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
  }, [fetchNextPage, startInfinityScroll, observeTargetRef, isFetching]);

  return (
    <main className="page-container min-h-[50vh] flex flex-col">
      <Head>
        <title>RAEBEF │ {filter.category.toUpperCase()}</title>
      </Head>

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

export default Categories;

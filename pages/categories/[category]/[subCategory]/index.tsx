import React, { MouseEvent, useEffect, useState } from "react";
import Button from "../../../../components/Button";
import {
  CategoryName,
  ColorType,
  FilterType,
  GenderType,
  OrderType,
  ProductType,
  SizeType,
} from "../../../../types";
import useGetProductsByFilter from "../../../../hooks/useGetProductsByFilter";
import { DocumentData } from "firebase/firestore";
import useGetProductsCount from "../../../../hooks/useGetProductsCount";
import HeaderWithFilter from "../../../../components/HeaderWithFilter";
import ProductList from "../../../../components/ProductList";
import { useRouter } from "next/router";

const Categories = () => {
  const { query, replace } = useRouter();
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
    const { gender, size, color, orderby, category, subCategory, keyword } =
      query;

    if (!category || !subCategory) {
      return;
    } else if (keyword) {
      replace(
        {
          query: { gender, size, color, orderby, category, subCategory },
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    const newFilter: FilterType = {
      category: category as CategoryName,
      subCategory: subCategory as string,
      gender: (gender as GenderType) || "all",
      size:
        !size || size === "all" || typeof size !== "string"
          ? []
          : (size.split(" ") as Array<SizeType>),
      color:
        !color || color === "all" || typeof color !== "string"
          ? ""
          : (color as ColorType),
      order: (orderby as OrderType) || "popularity",
    };

    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, [query, replace]);

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

export default Categories;

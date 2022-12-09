import { useRouter } from "next/router";
import React, { MouseEvent, useEffect, useState } from "react";
import ProductList from "../../components/ProductList";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import { categoryData } from "../../components/Nav";
import { useInfiniteQuery } from "react-query";
import getProducts from "../api/getProducts";
import { FilterType, ProductType } from "../../types";
import { FirebaseError } from "firebase/app";
import useReportError from "../../hooks/useReportError";
const Categories = () => {
  const reportError = useReportError();
  const {
    query: { categories },
    reload,
    back,
    asPath,
  } = useRouter();
  const [categoryHeader, setCategoryHeader] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<{
    category: string;
    subCategory?: string;
  }>({ category: "", subCategory: "" });
  const [filter, setFilter] = useState<FilterType>({
    gender: "",
    size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
    color: "",
    order: "orderCount",
  });

  const { status, data, error, fetchNextPage } = useInfiniteQuery<
    any,
    FirebaseError
  >({
    queryKey: ["products", categoryFilter, filter],
    queryFn: ({ pageParam }) => getProducts(categoryFilter, filter, pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.lastVisible,
    retry: false,
  });
  const [products, setProducts] = useState<Array<ProductType>>([]);
  console.log(asPath);
  // 카테고리 처리
  useEffect(() => {
    if (!categories || typeof categories === "string") return;

    // 카테고리 헤더
    let header = "";

    for (let i in categoryData) {
      if (categoryData[i].path === categories[0]) {
        header = categoryData[i].name;

        if (categories[1]) {
          for (let j in categoryData[i].subCategories) {
            if (categoryData[i].subCategories[j].path === categories[1]) {
              header += " - " + categoryData[i].subCategories[j].name;
            }
          }
        }
      }
    }

    setCategoryHeader(header);

    // 쿼리로 전달할 카테고리 필터
    if (!categories) {
      return;
    } else if (typeof categories === "string") {
      setCategoryFilter({ category: categories });
    } else if (categories.length === 1) {
      setCategoryFilter({ category: categories[0] });
    } else {
      setCategoryFilter({
        category: categories[0],
        subCategory: categories[1],
      });
    }
  }, [categories]);

  useEffect(() => {
    let productList: Array<ProductType> = [];

    data?.pages.forEach((page) =>
      page?.products.forEach((product: ProductType) => {
        productList.push(product);
      })
    );

    setProducts(productList);
  }, [data]);

  const onLoadMore = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchNextPage();
  };

  useEffect(() => {
    if (!status) return;

    switch (status) {
      case "error":
        if (error.code === "failed-precondition") {
          window?.alert("정의되지 않은 복합 필드 색인입니다.");
        }

        const ok = window.confirm(
          "오류 수정을 위해 에러 정보를 전송 하시겠습니까?\n보내주신 에러 데이터는 사이트 이용 경험 개선에 큰 도움이 됩니다."
        );

        if (ok) {
          const errorReport = {
            uid: "test",
            url: asPath,
            errorMessage: error.message,
            errorCode: error.code,
            filter: filter,
          };

          reportError(errorReport);
        }

        back();
        break;

      case "success":
        break;

      case "loading":
        break;

      default:
        break;
    }
  }, [status, error, reload, filter, back, asPath, reportError]);

  return (
    <div className="page-container">
      <Filter
        header={categoryHeader}
        filter={filter}
        setFilter={setFilter}
        productsLength={data?.pages[0].totalCount}
      />
      <ProductList products={products} />
      <div className="mx-auto text-center mt-10">
        {data?.pages[0].totalCount &&
        products.length < data?.pages[0].totalCount ? (
          <Button tailwindStyles="w-[200px]" onClick={onLoadMore}>
            더 보기
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Categories;

import { useRouter } from "next/router";
import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import { ProductType } from "../../types";
import productsData from "../../productsDummy.json";
import ProductList from "../../components/ProductList";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import { categoryData } from "../../components/Nav";

const Categories = () => {
  const { categories } = useRouter().query;
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [header, setHeader] = useState<string>("");

  /**
   * 제품이 카테고리에 속하는지 체크, db 연결 후에는 파이어베이스 쿼리로 대체
   * @param product 체크할 단일 제품 데이터
   * @param categories 단일 카테고리 문자열 혹은 카테고리 배열
   * @return boolean
   */
  const checkProductCategory = useCallback(
    (product: ProductType, categories: Array<string> | string) => {
      if (typeof categories === "string") {
        return product.categories.includes(categories);
      } else {
        for (let i in categories) {
          if (!product.categories.includes(categories[i])) return false;
        }
      }

      return true;
    },
    []
  );

  // 제품 데이터 불러오기, db 연결 후에는 리액트 쿼리로 대체
  useEffect(() => {
    if (!categories || !productsData) return;

    setProducts(
      productsData.filter((product) =>
        checkProductCategory(product, categories)
      )
    );
  }, [checkProductCategory, categories]);

  // 카테고리 헤더
  useEffect(() => {
    if (!categories || typeof categories === "string") return;

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

    setHeader(header);
  }, [categories]);

  const onLoadMore = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 제품 데이터를 이어서 불러오기
  };

  return (
    <div className="page-container">
      <Filter header={header} productsLength={products.length} />
      <ProductList products={products} />
      <div className="mx-auto text-center mt-10">
        <Button tailwindStyles="w-[200px]" onClick={onLoadMore}>
          더 보기
        </Button>
      </div>
    </div>
  );
};

export default Categories;

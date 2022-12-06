import { useRouter } from "next/router";
import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import { ProductType } from "../../types";
import productsData from "../../productsDummy.json";
import ProductList from "../../components/ProductList";
import Filter from "../../components/Filter";

const Categories = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Array<ProductType>>([]);

  /**
   * 제품이 카테고리에 속하는지 체크
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

  useEffect(() => {
    const { categories } = router.query;

    if (!categories || !productsData) return;

    setProducts(
      productsData.filter((product) =>
        checkProductCategory(product, categories)
      )
    );
  }, [checkProductCategory, router]);

  return (
    <div className="page-container">
      <Filter productsLength={products.length} />
      <ProductList products={products} />
    </div>
  );
};

export default Categories;

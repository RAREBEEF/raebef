import { useEffect, useState } from "react";
import useBookmark from "../hooks/useBookmark";
import useGetProductsById from "../hooks/useGetProductsById";
import { ProductType, UserData } from "../types";
import ProductList from "./ProductList";

interface Props {
  userData: UserData;
}

const AccountBookmark: React.FC<Props> = ({ userData }) => {
  const { data: productsData, isFetching } = useGetProductsById(
    userData?.bookmark || []
  );
  const {
    remove: { mutate: removeItem },
  } = useBookmark();
  const [products, setProducts] = useState<Array<ProductType> | null>([]);

  // 존재하지 않는 제품의 id는 북마크에서 제거
  useEffect(() => {
    if (!userData || !productsData || !userData?.bookmark) return;

    const { bookmark } = userData;

    bookmark.forEach((markedId) => {
      if (!productsData?.some((product) => product.id === markedId)) {
        removeItem({ uid: userData.user?.uid as string, productId: markedId });
      }
    });
  }, [productsData, productsData?.length, removeItem, userData]);

  // 북마크 추가/제거 로딩 중에도 리스트를 유지하기 위해 상태에 저장
  useEffect(() => {
    if (productsData !== undefined) {
      setProducts(productsData);
    }
  }, [productsData]);

  return (
    <section>
      <div className="mb-5 text-left text-base font-semibold text-zinc-500">
        {userData?.bookmark?.length || 0}개 제품
      </div>
      <div className="border-y py-5">
        {!isFetching &&
        ((userData && !userData?.bookmark) ||
          userData?.bookmark?.length === 0) ? (
          <p className="break-keep py-16 text-center text-lg font-semibold text-zinc-600">
            북마크가 비어있습니다.
          </p>
        ) : (
          <ProductList
            products={products || []}
            isFetching={!products && isFetching}
          />
        )}
      </div>
    </section>
  );
};

export default AccountBookmark;

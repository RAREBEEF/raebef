import { useEffect } from "react";
import useBookmark from "../hooks/useBookmark";
import useGetProductsById from "../hooks/useGetProductsById";
import useGetUserData from "../hooks/useGetUserData";
import ProductList from "./ProductList";

const AccountBookmark = () => {
  const { data: userData } = useGetUserData();
  const { data: productsData, isFetching } = useGetProductsById(
    userData?.bookmark || []
  );
  const {
    remove: { mutate: removeItem },
  } = useBookmark();

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

  return (
    <section className="">
      <div className="font-semibold text-left text-base text-zinc-500 mb-5">
        {userData?.bookmark?.length || 0}개 제품
      </div>
      <div className="border-y py-5">
        {!isFetching &&
        ((userData && !userData?.bookmark) ||
          userData?.bookmark?.length === 0) ? (
          <p className="py-16 text-center text-zinc-600 text-lg font-semibold break-keep">
            북마크가 비어있습니다.
          </p>
        ) : (
          <ProductList
            products={productsData || []}
            isFetching={!userData ? true : isFetching}
          />
        )}
      </div>
    </section>
  );
};

export default AccountBookmark;

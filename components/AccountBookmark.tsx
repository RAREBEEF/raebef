import useGetProductsById from "../hooks/useGetProductsById";
import useGetUserData from "../hooks/useGetUserData";
import ProductList from "./ProductList";

const AccountBookmark = () => {
  const { data: userData } = useGetUserData();
  const { data: ProductsData, isFetching } = useGetProductsById(
    userData?.bookmark || []
  );

  return (
    <section className="">
      <div className="font-semibold text-left text-base text-zinc-500 mb-5">
        {userData?.bookmark?.length || 0}개 제품
      </div>
      <div className="border-y py-5">
        {userData?.bookmark?.length === 0 ? (
          <p className="py-16 text-center text-zinc-600 text-lg font-semibold break-keep">
            북마크가 비어있습니다.
          </p>
        ) : (
          <ProductList
            products={ProductsData || []}
            isFetching={!userData ? true : isFetching}
          />
        )}
      </div>
    </section>
  );
};

export default AccountBookmark;

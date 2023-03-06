import { useEffect, useState } from "react";
import useCartSummary from "../hooks/useCartSummary";
import useGetProductsFromCart from "../hooks/useGetProductsFromCart";
import useModal from "../hooks/useModal";
import { ProductListType, StockType, UserData } from "../types";
import Button from "./Button";
import CartItemList from "./CartItemList";
import Modal from "./Modal";
import SkeletonCart from "./SkeletonCart";

interface Props {
  userData: UserData | null;
}

const CartPage: React.FC<Props> = ({ userData }) => {
  const { triggerModal, showModal } = useModal();
  const [idList, setIdList] = useState<Array<string> | null>(null);
  const {
    data: productsData,
    isFetching: productFetching,
    isFetched,
  } = useGetProductsFromCart(idList);
  const [products, setProducts] = useState<ProductListType | null>(null);
  const cartSummary = useCartSummary(
    userData || null,
    userData?.cart || null,
    products || null
  );

  // 제품 id 리스트 불러오기
  useEffect(() => {
    if (!userData?.cart) return;

    setIdList(Object.keys(userData?.cart as StockType));
  }, [userData]);

  // 카트 추가/제거 중에도 리스트를 유지하기 위해 상태에 저장
  useEffect(() => {
    if (productsData === undefined) return;

    setProducts(productsData);
  }, [productsData]);

  return (
    <div>
      {!userData || (!products && productFetching && !isFetched) ? (
        <SkeletonCart />
      ) : (
        <CartItemList
          cartSummary={cartSummary || null}
          productsData={products || null}
          cart={userData?.cart || null}
          userData={userData || undefined}
          triggerModal={triggerModal}
        />
      )}
      <div className="px-5 text-end xs:px-2">
        {(cartSummary?.outOfStock || cartSummary?.invalidProduct) && (
          <p className="mb-2 break-keep text-sm font-semibold text-red-500">
            품절되었거나 이용할 수 없는 제품이 포함되어 있습니다.
          </p>
        )}
        <Button
          theme="black"
          disabled={
            !cartSummary ||
            cartSummary.orderCount === 0 ||
            cartSummary.outOfStock ||
            cartSummary.invalidProduct
          }
          href={{ pathname: "/purchase", query: { target: "cart" } }}
        >
          결제하기
        </Button>
      </div>
      <Modal show={showModal} text="제품이 카트에서 제거되었습니다." />
    </div>
  );
};

export default CartPage;

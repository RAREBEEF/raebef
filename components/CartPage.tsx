import { useEffect, useState } from "react";
import useCartSummary from "../hooks/useCartSummary";
import useGetProductsFromCart from "../hooks/useGetProductsFromCart";
import useModal from "../hooks/useModal";
import { StockType, UserData } from "../types";
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
  const { data: products, isFetching: productFetching } =
    useGetProductsFromCart(idList);
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

  return (
    <div>
      {productFetching || !userData ? (
        <SkeletonCart />
      ) : (
        <CartItemList
          cartSummary={cartSummary || null}
          productsData={products || null}
          cart={userData?.cart || null}
          userData={userData}
          triggerModal={triggerModal}
        />
      )}
      <div className="text-end px-5 xs:px-2">
        <Button
          theme="black"
          disabled={
            !cartSummary ||
            cartSummary.orderCount === 0 ||
            cartSummary?.outOfStock ||
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

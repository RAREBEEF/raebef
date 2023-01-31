import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CartItemList from "../components/CartItemList";
import HeaderBasic from "../components/HeaderBasic";
import Modal from "../components/Modal";
import SkeletonCart from "../components/SkeletonCart";
import useCartSummary from "../hooks/useCartSummary";
import useGetCartProducts from "../hooks/useGetProductsFromCart";
import useGetUserData from "../hooks/useGetUserData";
import useModal from "../hooks/useModal";
import { StockType } from "../types";

const Cart = () => {
  const { triggerModal, showModal } = useModal();
  const { replace } = useRouter();
  const [init, setInit] = useState<boolean>(false);
  const [idList, setIdList] = useState<Array<string> | null>(null);
  const {
    data: userData,
    isFetched: userFetched,
    isFetching: userFetching,
  } = useGetUserData();
  const {
    data: products,
    isFetched: productFetched,
    isFetching: productFetching,
  } = useGetCartProducts(idList);
  const cartSummary = useCartSummary(
    userData || null,
    userData?.cart || null,
    products || null
  );

  // 제품 id 리스트 불러오기
  useEffect(() => {
    if (!userData || !userData.cart) return;

    setIdList(Object.keys(userData?.cart as StockType));
  }, [userData]);

  // 준비 완료
  useEffect(() => {
    if (productFetched) setInit(true);
  }, [productFetched]);

  // 로그인 여부 체크
  useEffect(() => {
    if (userFetched && !userData) {
      replace(
        {
          pathname: "/login",
          query: {
            from: "/cart",
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [replace, userFetched, userData]);

  return (
    <main className="page-container">
      <HeaderBasic
        title={{ text: "쇼핑 카트" }}
        parent={{ text: "제품 구매" }}
      />
      <section className="px-12 xs:px-5">
        {userFetching || productFetching || !init || !userData ? (
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
      </section>
      <Modal show={showModal} text="제품이 카트에서 제거되었습니다." />
    </main>
  );
};

export default Cart;

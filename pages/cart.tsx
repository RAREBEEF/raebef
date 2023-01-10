import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CartItemList from "../components/CartItemList";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import SkeletonCart from "../components/SkeletonCart";
import useGetCartProducts from "../hooks/useGetCartProducts";
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
    if (userFetched && !userData)
      replace({
        pathname: "/login",
        query: {
          from: "/cart",
        },
      });
  }, [replace, userFetched, userData]);

  return (
    <main className="page-container">
      <PageHeader
        title={{ text: "쇼핑 카트" }}
        parent={{ text: "제품 구매" }}
      />
      {productFetching || !init ? (
        <SkeletonCart />
      ) : (
        <CartItemList
          products={products}
          cart={userData?.cart}
          userData={userData}
          triggerModal={triggerModal}
        />
      )}
      <Modal show={showModal} text="카트에서 제거되었습니다." />
    </main>
  );
};

export default Cart;

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CartPage from "../components/CartPage";
import HeaderBasic from "../components/HeaderBasic";
import useGetUserData from "../hooks/useGetUserData";

const Cart = () => {
  const { replace } = useRouter();
  const { data: userData, isFetched: userFetched } = useGetUserData();

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
      <Head>
        <title>RAEBEF │ CART</title>
      </Head>
      <HeaderBasic
        title={{ text: "쇼핑 카트" }}
        parent={{ text: "제품 구매" }}
      />
      <section className="px-12 xs:px-5">
        <CartPage userData={userData || null} />
      </section>
    </main>
  );
};

export default Cart;

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormPurchase from "../../components/FormPurchase";
import HeaderBasic from "../../components/HeaderBasic";
import Loading from "../../components/AnimtaionLoading";
import useGetCartProducts from "../../hooks/useGetCartProducts";
import useGetUserData from "../../hooks/useGetUserData";
import { CartType } from "../../types";

const Purchase = () => {
  const router = useRouter();
  const [init, setInit] = useState<boolean>(false);
  const [target, setTarget] = useState<CartType | null>(null);
  const { data: productsData } = useGetCartProducts(Object.keys(target || {}));
  const { data: userData, isFetched: userFetched } = useGetUserData();

  useEffect(() => {
    if (!userData) return;

    const { target } = router.query;

    if (
      target === "cart" &&
      userData.cart &&
      Object.keys(userData.cart).length !== 0
    ) {
      setTarget(userData.cart);
    } else if (target === "tempCart") {
      const item = sessionStorage.getItem("tempCart");
      if (item) {
        setTarget(JSON.parse(item));
      } else {
        router.replace({
          pathname: "/cart",
        });
      }
    } else {
      router.replace({
        pathname: "/cart",
      });
    }

    setInit(true);
  }, [router, router.query, userData]);

  useEffect(() => {
    if (userFetched && !userData)
      router.replace({
        pathname: "/login",
        query: {
          from: `/purchase?target=${router.query.target}`,
        },
      });
  }, [init, router, target, userData, userFetched]);

  return (
    <main className="page-container">
      <HeaderBasic
        title={{ text: "결제하기" }}
        parent={{ text: "제품 구매" }}
      />
      {userData && productsData && target && (
        <section className="px-12 xs:px-5">
          <FormPurchase
            userData={userData}
            cart={target}
            target={(router.query.target as string) || ""}
          />
        </section>
      )}
      <Loading show={!init} fullScreen={true} />
    </main>
  );
};

export default Purchase;

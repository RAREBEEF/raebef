import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormPurchase from "../../components/FormPurchase";
import HeaderBasic from "../../components/HeaderBasic";
import Loading from "../../components/AnimtaionLoading";
import useGetUserData from "../../hooks/useGetUserData";
import { CartType } from "../../types";
import Seo from "../../components/Seo";

const Purchase = () => {
  const { query, replace } = useRouter();
  const [init, setInit] = useState<boolean>(false);
  const [target, setTarget] = useState<CartType | null>(null);
  const { data: userData, isFetched: userFetched } = useGetUserData();

  useEffect(() => {
    if (!userData) return;

    const { target } = query;

    if (
      target === "cart" &&
      userData.cart &&
      Object.keys(userData.cart).length !== 0
    ) {
      setTarget(userData.cart);

      setInit(true);
      return;
    } else if (target === "tempCart") {
      const item = sessionStorage.getItem("tempCart");

      if (item) {
        setTarget(JSON.parse(item));
        setInit(true);
        return;
      }
    }

    replace(
      {
        pathname: "/cart",
      },
      undefined,
      { shallow: true }
    );
  }, [query, replace, userData]);

  useEffect(() => {
    if (userFetched && !userData) {
      replace(
        {
          pathname: "/login",
          query: {
            from: `/purchase?target=${query.target}`,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [init, query.target, replace, target, userData, userFetched]);

  return (
    <main className="page-container">
       <Seo title="PURCHASE" />
      <HeaderBasic
        title={{ text: "결제하기" }}
        parent={{ text: "제품 구매" }}
      />
      {userData && target && (
        <section className="px-12 xs:px-5">
          <FormPurchase
            userData={userData}
            cart={target}
            target={(query.target as string) || ""}
          />
        </section>
      )}
      <Loading show={!init} fullScreen={true} />
    </main>
  );
};

export default Purchase;

import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "../../components/AnimtaionLoading";
import HeaderBasic from "../../components/HeaderBasic";
import OrderList from "../../components/OrderList";
import Seo from "../../components/Seo";
import useGetUserData from "../../hooks/useGetUserData";
import useIsAdmin from "../../hooks/useIsAdmin";

const Orders = () => {
  const { replace } = useRouter();
  const { data: userData, isFetched } = useGetUserData();
  const isAdmin = useIsAdmin(userData);

  useEffect(() => {
    if (userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      replace("/", undefined, { shallow: true });
    }
  }, [isAdmin, replace, userData]);

  useEffect(() => {
    if (isFetched && !userData) {
      replace(
        {
          pathname: "/login",
          query: {
            from: "/admin",
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [isFetched, replace, userData]);

  return (
    <main className="page-container flex flex-col">
      <Seo title="ORDERS" />
      <HeaderBasic title={{ text: "주문 관리" }} />
      {isAdmin ? (
        <section className="px-12 pb-24 xs:px-5">
          <OrderList userData={userData || null} />
        </section>
      ) : (
        <div className="flex grow items-center justify-center">
          <Loading />
        </div>
      )}
    </main>
  );
};

export default Orders;

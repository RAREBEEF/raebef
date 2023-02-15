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
      <HeaderBasic
        title={{ text: "주문 관리" }}
        parent={{ text: "관리 메뉴", href: "/admin" }}
      />
      {isAdmin ? (
        <div className="px-12 xs:px-5">
          <OrderList userData={userData || null} />
        </div>
      ) : (
        <div className="grow flex justify-center items-center">
          <Loading />
        </div>
      )}
    </main>
  );
};

export default Orders;

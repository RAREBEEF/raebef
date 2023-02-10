import { DocumentData } from "firebase/firestore";
import { MouseEvent, ReactNode, useEffect, useState } from "react";
import Button from "../../components/Button";
import HeaderBasic from "../../components/HeaderBasic";
import OrderListItem from "../../components/OrderListItem";
import SkeletonOrderListItem from "../../components/SkeletonOrderListItem";
import useGetOrders from "../../hooks/useGetOrders";
import useGetUserData from "../../hooks/useGetUserData";
import useIsAdmin from "../../hooks/useIsAdmin";
import { OrderData } from "../../types";

const Orders = () => {
  const { data: userData } = useGetUserData();
  const isAdmin = useIsAdmin(userData);
  const {
    data: { data: ordersData, isFetching, fetchNextPage },
    count: { data: totalCountData },
  } = useGetOrders({ isAdmin });
  const [orders, setOrders] = useState<Array<OrderData>>([]);

  // 불러온 주문 데이터를 상태로 저장
  useEffect(() => {
    let orderList: Array<OrderData> = [];

    ordersData?.pages.forEach(
      (page: { orders: Array<OrderData>; lastVisible: DocumentData | null }) =>
        page?.orders.forEach((order: OrderData) => {
          orderList.push(order);
        })
    );

    setOrders(orderList);
  }, [ordersData]);

  // 더 보기 버튼
  const onLoadMore = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchNextPage();
  };

  // 개수에 맞게 스켈레톤 로더 생성하기
  const skeletonGenerator = (count: number) => {
    const skeletonList: Array<ReactNode> = [];
    for (let i = 0; i < count; i++) {
      skeletonList.push(<SkeletonOrderListItem key={i} />);
    }

    return skeletonList;
  };

  return (
    <main className="page-container">
      <HeaderBasic
        title={{ text: "주문 관리" }}
        parent={{ text: "관리 메뉴", href: "/admin" }}
      />
      <section className="px-12 xs:px-5">
        <div className="font-semibold text-left text-base text-zinc-500 mb-5">
          총 {totalCountData || 0}건 주문
        </div>
        <ul className="flex flex-col gap-2 border-y py-5">
          {userData &&
            orders?.map((order, i) => {
              return (
                <OrderListItem
                  key={i}
                  orderData={order}
                  isAdmin={true}
                  userData={userData}
                />
              );
            })}
          {!isFetching && totalCountData === 0 && (
            <p className="py-16 text-center text-zinc-600 text-lg font-semibold break-keep">
              주문 내역이 없습니다.
            </p>
          )}
          {!isFetching &&
          totalCountData &&
          Object.keys(orders).length < totalCountData ? (
            <div className="mx-auto text-center mt-5">
              <Button tailwindStyles="w-[200px]" onClick={onLoadMore}>
                더 보기
              </Button>
            </div>
          ) : null}
          {(!isAdmin || isFetching) && skeletonGenerator(10)}
        </ul>
      </section>
    </main>
  );
};

export default Orders;

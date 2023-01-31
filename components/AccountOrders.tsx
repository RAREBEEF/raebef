import { DocumentData } from "firebase/firestore";
import { MouseEvent, useEffect, useState } from "react";
import useGetOrdersCountForUser from "../hooks/useGetOrdersCount";
import useGetOrdersForUser from "../hooks/useGetOrders";
import useGetUserData from "../hooks/useGetUserData";
import { OrderData } from "../types";
import Button from "./Button";
import OrderListItem from "./OrderListItem";
import SkeletonOrderListItem from "./SkeletonOrderListItem";

const AccountOrders = () => {
  const { data: userData } = useGetUserData();
  const {
    data: ordersData,
    isFetching,
    fetchNextPage,
  } = useGetOrdersForUser(userData?.user?.uid || "");
  const { data: totalCountData } = useGetOrdersCountForUser(
    userData?.user?.uid || ""
  );
  const [orders, setOrders] = useState<Array<OrderData>>([]);

  // 불러온 상품 데이터를 상태로 저장
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

  return (
    <section>
      <div className="font-semibold text-left text-base text-zinc-500 mb-5">
        총 {totalCountData || 0}건 주문
      </div>
      <ul className="flex flex-col gap-2 border-y py-5">
        {orders?.map((order, i) => {
          return <OrderListItem key={i} orderData={order} />;
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
        {!userData ||
          (isFetching &&
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => (
              <SkeletonOrderListItem key={el} />
            )))}
      </ul>
    </section>
  );
};

export default AccountOrders;

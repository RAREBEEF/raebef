import { DocumentData } from "firebase/firestore";
import { MouseEvent, ReactNode, useEffect, useState } from "react";
import useGetOrders from "../hooks/useGetOrders";
import { OrderData, UserData } from "../types";
import Button from "./Button";
import OrderListItem from "./OrderListItem";
import SkeletonOrderListItem from "./SkeletonOrderListItem";

interface Props {
  userData: UserData;
}

const AccountOrders: React.FC<Props> = ({ userData }) => {
  const {
    data: { data: ordersData, isFetching, fetchNextPage },
    count: { data: totalCountData },
  } = useGetOrders({ uid: userData?.user?.uid || "" });
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
    <section>
      <div className="font-semibold text-left text-base text-zinc-500 mb-5">
        총 {totalCountData || 0}건 주문
      </div>
      <ul className="flex flex-col gap-2 border-y py-5">
        {orders?.map((order, i) => {
          return (
            <OrderListItem key={i} orderData={order} userData={userData} />
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
        {(!userData || isFetching) && skeletonGenerator(10)}
      </ul>
    </section>
  );
};

export default AccountOrders;

import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import useGetOrders from "../hooks/useGetOrders";
import useInput from "../hooks/useInput";
import useIsAdmin from "../hooks/useIsAdmin";
import {
  OrderData,
  OrderFilterType,
  OrderOrderbyType,
  OrderStatusType,
  UserData,
} from "../types";
import Button from "./Button";
import OrderListItem from "./OrderListItem";
import { statusDict } from "./OrderListItemDetail";
import SkeletonOrderListItem from "./SkeletonOrderListItem";

interface Props {
  userData: UserData | null;
}

const OrderList: React.FC<Props> = ({ userData }) => {
  const [skeletonCount, setSkeletonCount] = useState<number>(12);
  const { pathname, query, push } = useRouter();
  const isAdmin = useIsAdmin(userData);
  const [filter, setFilter] = useState<OrderFilterType>({
    orderby: "updated",
    status: "all",
    orderId: "",
    uid: "",
  });
  const {
    data: { data: ordersData, isFetching, fetchNextPage },
    count: { data: totalCountData },
  } = useGetOrders({ uid: userData?.user?.uid || "", filter, isAdmin });
  const [orders, setOrders] = useState<Array<OrderData>>([]);
  const { value: uid, setValue: setUid, onChange: onUidChange } = useInput("");
  const {
    value: orderId,
    setValue: setOrderId,
    onChange: onOrderIdChange,
  } = useInput("");

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

  // 정렬
  const onOrderbyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    push({ query: { ...query, orderby: value, detail: "" } });
  };

  // 주문 상태
  const onStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    push({ query: { ...query, status: value, detail: "" } });
  };

  // 검색 id
  const onSearchId = (e: FormEvent) => {
    e.preventDefault();

    const newQueries = { ...query };

    if (!uid) {
      delete newQueries.uid;
    } else {
      newQueries.uid = uid;
    }
    if (!orderId) {
      delete newQueries.orderId;
    } else {
      newQueries.orderId = orderId;
    }

    push({
      query: { ...newQueries, detail: "" },
    });
  };

  const onReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    push({ query: {} });
    setUid("");
    setOrderId("");
  };

  // 쿼리에 맞춰 필터 업데이트
  useEffect(() => {
    const { orderby, status, orderId, uid } = query;
    const newFilter: OrderFilterType = {
      orderby: (orderby as OrderOrderbyType) || "updated",
      status: (status as OrderStatusType) || "all",
      orderId: (orderId as string) || "",
      uid: (uid as string) || "",
    };

    setFilter((prev) => ({ ...prev, ...newFilter }));
    uid && setUid(uid as string);
    orderId && setOrderId(orderId as string);
  }, [isAdmin, query, setOrderId, setUid, userData]);

  // 스크롤 복원용 주문내역 개수 저장
  useEffect(() => {
    sessionStorage.setItem("ordersListLength", orders.length.toString());
  }, [orders]);

  // 스켈레톤 로더의 개수를 구한다.
  useEffect(() => {
    if (!orders) {
      const item = sessionStorage.getItem("orderssListLength");
      if (item) {
        setSkeletonCount(parseInt(item));
      }
      return;
    } else {
      setSkeletonCount(12);
    }
  }, [orders]);

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

  return (
    <section>
      <div className="mb-5 text-left text-base font-semibold text-zinc-500">
        총 {totalCountData || 0}건 주문
      </div>
      <ul className="mb-10 flex flex-wrap items-center justify-end gap-5 px-2 text-center font-bold text-zinc-800">
        <li>
          <h3 className="mb-1 border-b border-zinc-200 text-lg font-semibold">
            주문 상태
          </h3>
          <select
            className="cursor-pointer text-center text-sm text-zinc-500"
            onChange={onStatusChange}
            value={filter.status}
          >
            <option value="all">전체</option>
            {Object.entries(statusDict).map((status, i) => {
              return isAdmin ||
                (!isAdmin &&
                  [
                    "Payment completed",
                    "Preparing product",
                    "Shipping in progress",
                    "Refund completed",
                    "Complete",
                  ].includes(status[0])) ? (
                <option key={i} value={status[0]}>
                  {status[1]}
                </option>
              ) : null;
            })}
          </select>
        </li>
        <li>
          <h3 className="mb-1 border-b border-zinc-200 text-lg font-semibold">
            정렬 기준
          </h3>
          <select
            className="cursor-pointer text-center text-sm text-zinc-500"
            onChange={onOrderbyChange}
            value={filter.orderby}
          >
            <option value="updated">업데이트 순</option>
            <option value="createdAt">최신 순</option>
            <option value="createdAtAcs">오래된 순</option>
          </select>
        </li>
        <li className="font-medium">
          <form
            onSubmit={onSearchId}
            className={`gap-2 ${
              isAdmin
                ? "grid grid-flow-col grid-rows-2"
                : "flex h-full items-center justify-center"
            }`}
          >
            <input
              value={orderId}
              onChange={onOrderIdChange}
              placeholder="주문 ID"
              className="h-full pl-2"
              style={{
                borderBottom: "1.5px solid rgb(228 228 231)",
              }}
            />
            {isAdmin && (
              <input
                value={uid}
                onChange={onUidChange}
                placeholder="사용자 ID"
                className="pl-2"
                style={{
                  borderBottom: "1.5px solid rgb(228 228 231)",
                }}
              />
            )}
            <Button
              theme="black"
              tailwindStyles="h-full text-sm self-center row-span-2"
            >
              검색
            </Button>
          </form>
        </li>
        <li>
          <Button onClick={onReset} tailwindStyles="text-sm">
            초기화
          </Button>
        </li>
      </ul>

      <ul className="flex flex-col gap-12 border-y py-12">
        {userData &&
          orders?.map((order, i) => {
            return (
              <OrderListItem
                key={i}
                orderData={order}
                userData={userData}
                isAdmin={isAdmin && pathname.includes("admin")}
              />
            );
          })}
        {!isFetching && totalCountData === 0 && (
          <p className="break-keep py-16 text-center text-lg font-semibold text-zinc-600">
            주문 내역이 없습니다.
          </p>
        )}
        {!isFetching &&
        totalCountData &&
        Object.keys(orders).length < totalCountData ? (
          <div className="mx-auto mt-5 text-center">
            <Button tailwindStyles="w-[200px]" onClick={onLoadMore}>
              더 보기
            </Button>
          </div>
        ) : null}
        {(!userData || isFetching) && skeletonGenerator(skeletonCount)}
      </ul>
    </section>
  );
};

export default OrderList;

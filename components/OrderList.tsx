import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  use,
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
  }, [query, setOrderId, setUid]);

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

    if (!uid && !orderId) {
      window.alert("ID를 입력해 주세요");
      return;
    }

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

  return (
    <section>
      <div className="mb-5 font-semibold text-left text-base text-zinc-500">
        총 {totalCountData || 0}건 주문
      </div>
      <ul className="px-2 flex justify-end gap-5 flex-wrap mb-10 text-zinc-800 font-bold text-center">
        <li>
          <h3 className="text-lg font-semibold mb-1 border-b border-zinc-200">
            주문 상태
          </h3>
          <select
            className="cursor-pointer text-sm text-center text-zinc-500"
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
          <h3 className="text-lg font-semibold mb-1 border-b border-zinc-200">
            정렬 기준
          </h3>
          <select
            className="cursor-pointer text-sm text-center text-zinc-500"
            onChange={onOrderbyChange}
            value={filter.orderby}
          >
            <option value="updated">업데이트 순</option>
            <option value="createdAt">추가된 순</option>
            <option value="createdAtAcs">오래된 순</option>
          </select>
        </li>
        <li className="font-medium">
          <form
            onSubmit={onSearchId}
            className={`gap-2 ${
              isAdmin
                ? "grid grid-rows-2 grid-flow-col"
                : "h-full flex justify-center items-center"
            }`}
          >
            <input
              value={orderId}
              onChange={onOrderIdChange}
              placeholder="주문 ID"
              className="pl-2 h-full"
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
              tailwindStyles="h-full text-sm self-end row-span-2"
            >
              검색
            </Button>
          </form>
        </li>
        <li>
          <Button onClick={onReset} tailwindStyles="h-full">
            초기화
          </Button>
        </li>
      </ul>

      <ul className="gap-5 border-y py-5">
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
        {(!userData || isFetching) && skeletonGenerator(skeletonCount)}
      </ul>
    </section>
  );
};

export default OrderList;

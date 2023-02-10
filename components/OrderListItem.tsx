import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { OrderData, UserData } from "../types";
import Button from "./Button";
import OrderListItemDetail from "./OrderListItemDetail";

interface Props {
  orderData: OrderData;
  userData: UserData;
  isAdmin?: boolean;
}

const statusDict = {
  "Payment in progress": "결제 진행 중",
  "Payment completed": "결제 완료",
  "Preparing product": "제품 준비 중",
  "Payment failed": "결제 실패",
  "Payment cancelled": "결제 취소",
  "Shipping in progress": "배송 중",
  "Order Cancelled": "주문 취소",
  "Refund completed": "환불 완료",
  Complete: "배송 완료",
};

const OrderListItem: React.FC<Props> = ({
  orderData,
  isAdmin = false,
  userData,
}) => {
  const { query } = useRouter();

  const onCopyOrderId = (e: MouseEvent<HTMLButtonElement>, orderId: string) => {
    e.preventDefault();

    if (typeof window === "undefined" || !orderId) return;

    window.navigator.clipboard.writeText(orderId);
  };

  const onCopyUid = (e: MouseEvent<HTMLButtonElement>, uid: string) => {
    e.preventDefault();

    if (typeof window === "undefined" || !uid) return;

    window.navigator.clipboard.writeText(uid);
  };

  return (
    <div className="flex flex-col border rounded-lg">
      <Link
        scroll={false}
        href={
          isAdmin
            ? query.detail === orderData.orderId
              ? "/admin/orders"
              : `/admin/orders?detail=${orderData.orderId}`
            : query.detail === orderData.orderId
            ? "/account?tab=orders"
            : `/account?tab=orders&detail=${orderData.orderId}`
        }
      >
        <li
          className={`relative p-5 flex items-center justify-between flex-wrap gap-x-12 gap-y-5 text-zinc-800 font-semibold text-2xl whitespace-nowrap xs:px-2`}
        >
          <div className="flex flex-col gap-1 md:gap-0">
            <h4 className="text-sm text-zinc-500 xs:text-xs">
              <span className="sm:hidden">ID:</span>
              {orderData.orderId}{" "}
              <Button
                tailwindStyles="text-xs px-1 py-1"
                onClick={(e) => onCopyOrderId(e, orderData.orderId)}
              >
                복사<span className="sm:hidden">하기</span>
              </Button>
            </h4>
            <h4 className="text-sm text-zinc-500 xs:text-xs">
              <span>UID : </span>
              {orderData.uid}{" "}
              <Button
                tailwindStyles="text-xs px-1 py-1"
                onClick={(e) => onCopyUid(e, orderData.uid)}
              >
                복사<span className="sm:hidden">하기</span>
              </Button>
            </h4>
            <h3 className="relative basis-[15%] min-w-[100px] h-full">
              {orderData.orderName}
            </h3>
            <span className="text-sm whitespace-pre-wrap mt-2">
              {orderData.addressData.address}{" "}
              {orderData.addressData.additional || ""} (
              {orderData.addressData.postCode})
            </span>
          </div>

          <div className="text-end md:w-full">
            <div
              className={`text-sm font-bold ${
                [
                  "Payment failed",
                  "Order Cancelled",
                  "Refund completed",
                  "Payment cancelled",
                ].includes(orderData.status) && "text-red-600"
              }`}
            >
              {statusDict[orderData.status]}
            </div>
            {query.detail !== orderData.orderId && (
              <span>{orderData.amount.toLocaleString("ko-KR")} ₩</span>
            )}
          </div>
        </li>
      </Link>
      {query.detail === orderData.orderId && (
        <OrderListItemDetail
          orderData={orderData}
          isAdmin={isAdmin}
          userData={userData}
        />
      )}
    </div>
  );
};

export default OrderListItem;

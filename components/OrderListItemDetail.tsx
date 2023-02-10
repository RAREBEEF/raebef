import { MouseEvent, useEffect, useState } from "react";
import useCancelPayment from "../hooks/useCancelPayment";
import useCartSummary from "../hooks/useCartSummary";
import useGetCartProducts from "../hooks/useGetProductsFromCart";
import useInput from "../hooks/useInput";
import useOrderData from "../hooks/useOrderData";
import useUpdateStockAndOrderCount from "../hooks/useUpdateStockAndOrderCount";
import { OrderData, UserData } from "../types";
import Button from "./Button";
import CartItemList from "./CartItemList";
import SkeletonCart from "./SkeletonCart";

interface Props {
  orderData: OrderData;
  isAdmin?: boolean;
  userData: UserData;
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

const OrderListItemDetail: React.FC<Props> = ({
  orderData,
  isAdmin = false,
  userData,
}) => {
  const [paymentKey, setPaymentKey] = useState<string>("");
  const { data: productsData } = useGetCartProducts(
    Object.keys(orderData.products || [])
  );
  const {
    data: cancelData,
    isFetched: cancelDataFetched,
    isError: cancelDataError,
  } = useCancelPayment({
    paymentKey,
    cancelReason: "고객이 취소를 원함",
  });
  const {
    update: { mutateAsync: updateOrderData, isSuccess: updateOrderDataSuccess },
  } = useOrderData(orderData.orderId || "");
  const { mutateAsync: updateStock, isSuccess: updateStockSuccess } =
    useUpdateStockAndOrderCount();
  const cartSummary = useCartSummary(
    userData || null,
    orderData.products,
    productsData || null
  );
  const {
    value: status,
    setValue: setStatus,
    onChange: onStatusChange,
  } = useInput(orderData.status || "Payment in progress");

  // 주문 취소 시 데이터 처리
  const handleOrderData = async () => {
    // 주문 상태 업데이트
    await updateOrderData({
      orderId: orderData.orderId,
      orderData: {
        status: "Refund completed",
      },
    });

    // 재고수량 복구
    await updateStock({ cart: orderData.products, restore: true });
  };

  // 주문 취소 클릭
  const onCancelOrder = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (window.confirm("주문을 취소하시겠습니까?")) {
      handleOrderData()
        .then(() => {
          setPaymentKey(orderData.payment.paymentKey);
        })
        .catch((error) => {
          console.error(error);

          // 에러 발생 전 이미 처리된 데이터 롤백
          updateOrderDataSuccess &&
            updateOrderData({
              orderId: orderData.orderId,
              orderData: {
                status: "Refund failed",
              },
            });
          updateStockSuccess && updateStock({ cart: orderData.products });

          window.alert(
            "주문을 취소하는 과정에서 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
          );
        });
    }
  };

  // 결제 취소 성공 여부 체크
  useEffect(() => {
    // paymentKey가 아직 할당되지 않았으면(취소할 order가 없으면) 리턴
    if (!paymentKey || !cancelDataFetched) return;

    // paymentKey 초기화
    setPaymentKey("");

    // 결제 취소에 성공했을 경우
    if (cancelData) {
      updateOrderData({
        orderId: orderData.orderId,
        orderData: { payment: { ...cancelData } },
      });
      window.alert("주문이 취소되었습니다.");

      // 결제 취소에 실패한 경우
    } else if (cancelDataError) {
      // 업데이트한 데이터 롤백
      updateOrderDataSuccess &&
        updateOrderData({
          orderId: orderData.orderId,
          orderData: {
            status: "Refund failed",
          },
        });
      updateStockSuccess && updateStock({ cart: orderData.products });

      window.alert(
        "주문을 취소하는 과정에서 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
      );
    }
  }, [
    cancelData,
    cancelDataError,
    cancelDataFetched,
    orderData.orderId,
    orderData.products,
    paymentKey,
    updateOrderData,
    updateOrderDataSuccess,
    updateStock,
    updateStockSuccess,
  ]);

  // 주문 상태 업데이트
  const onUpdateStatus = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      ["Payment failed", "Payment cancelled", "Refund completed"].includes(
        status
      )
    ) {
      const ok = window.confirm(
        "결제 금액이 지불되지 않은 상태로 변경하고자 합니다.\n해당 기능은 결제의 상태만 변경하며 실제 결제의 취소는 이루어지지 않습니다.\n결제의 취소를 원하시는 경우 별도로 나타나는 버튼을 이용해 주세요.\n(결제 취소가 가능한 경우 버튼이 나타납니다.)\n상태를 변경하시겠습니까?"
      );

      if (!ok) return;
    }

    updateOrderData({
      orderId: orderData.orderId,
      orderData: { status },
    })
      .then(() => {
        window.alert("주문 상태가 변경되었습니다.");
      })
      .catch((error) => {
        console.error(error);
        window.alert(
          "상태를 변경하는 과정에서 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
        );
      });
  };

  return (
    <div className="text-end p-5 pt-0">
      {userData && productsData ? (
        <CartItemList
          productsData={productsData}
          cart={orderData.products}
          cartSummary={cartSummary}
          withoutDeleteBtn={true}
          withoutStockInfo={true}
        />
      ) : (
        <SkeletonCart withoutDeleteBtn={true} />
      )}
      <section className="flex justify-end gap-12 m-5">
        {orderData.payment && !orderData.payment.cancels && (
          <div className="flex flex-col gap-2 items-end">
            {isAdmin && (
              <h3 className="text-zinc-800 font-semibold text-lg">
                결제 취소하기
              </h3>
            )}
            <Button onClick={onCancelOrder} theme="red">
              {isAdmin ? "결제" : "주문"} 취소
            </Button>
          </div>
        )}
        {isAdmin && (
          <label className="flex flex-col gap-2 items-end">
            <h3 className="text-zinc-800 font-semibold text-lg">
              주문 상태 변경
            </h3>
            <select
              style={{
                border: "1px solid #1f2937",
              }}
              className="px-2 py-1"
              value={status}
              onChange={onStatusChange}
            >
              {Object.entries(statusDict).map((status, i) => (
                <option key={i} value={status[0]}>
                  {status[1]}
                </option>
              ))}
            </select>
            <Button onClick={onUpdateStatus} theme="black">
              변경하기
            </Button>
          </label>
        )}
      </section>
    </div>
  );
};

export default OrderListItemDetail;

import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import useCancelPayment from "../hooks/useCancelPayment";
import useCartSummary from "../hooks/useCartSummary";
import useGetCartProducts from "../hooks/useGetProductsFromCart";
import useGetUserData from "../hooks/useGetUserData";
import useOrderData from "../hooks/useOrderData";
import useUpdateStockAndOrderCount from "../hooks/useUpdateStockAndOrderCount";
import { OrderData } from "../types";
import Button from "./Button";
import CartItemList from "./CartItemList";
import SkeletonCart from "./SkeletonCart";

interface Props {
  orderData: OrderData;
}

const OrderListItemDetail: React.FC<Props> = ({ orderData }) => {
  const { reload } = useRouter();
  const [paymentKey, setPaymentKey] = useState<string>("");
  const { data: userData } = useGetUserData();
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

    // 리로드
    reload();
  }, [
    cancelData,
    cancelDataError,
    cancelDataFetched,
    orderData.orderId,
    orderData.products,
    paymentKey,
    reload,
    updateOrderData,
    updateOrderDataSuccess,
    updateStock,
    updateStockSuccess,
  ]);

  return (
    <div className="text-end p-5 pt-0">
      {userData && productsData ? (
        <CartItemList
          userData={userData}
          productsData={productsData}
          cart={orderData.products}
          cartSummary={cartSummary}
          withoutAction={true}
          withoutStockInfo={true}
        />
      ) : (
        <SkeletonCart withoutAction={true} />
      )}
      {[
        "Payment completed",
        "Preparing product",
        "Shipping in progress",
        "Complete",
      ].includes(orderData.status) && (
        <Button onClick={onCancelOrder} theme="red">
          주문 취소
        </Button>
      )}
    </div>
  );
};

export default OrderListItemDetail;

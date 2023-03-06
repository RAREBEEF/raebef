import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderBasic from "../../components/HeaderBasic";
import useConfirmPayment from "../../hooks/useConfirmPayment";
import { ConfirmPaymentData } from "../../types";
import useUpdateStockAndOrderCount from "../../hooks/useUpdateStockAndOrderCount";
import useCart from "../../hooks/useCart";
import Loading from "../../components/AnimtaionLoading";
import Done from "../../components/AnimationDone";
import useOrderData from "../../hooks/useOrderData";
import Seo from "../../components/Seo";

const PurchaseSuccess = () => {
  const { replace, query } = useRouter();
  const [confirmData, setConfirmData] = useState<ConfirmPaymentData | null>(
    null
  );
  const {
    get: { data: orderData, isError: orderDataFail },
    update: { mutateAsync: updateOrderData },
  } = useOrderData((query?.orderId as string) || "");
  const {
    data: paymentData,
    isFetched: paymentFetched,
    error: fetchError,
  } = useConfirmPayment(confirmData);
  const { mutate: updateStock } = useUpdateStockAndOrderCount();
  const { clear: clearCart } = useCart();
  const [processComplete, setProcessComplete] = useState<boolean>(false);

  // 유효성 체크 후 결제 승인 요청
  useEffect(() => {
    // 주문 데이터와 결제 금액이 없으면 리턴
    if (!orderData || !query.amount) return;

    // 주문과 실결제 금액이 일치하는지 확인 후
    if (orderData.amount === parseInt(query.amount as string)) {
      // 결제 정보 확인 데이터를 상태에 업데이트
      // 결제 확인 데이터가 업데이트되면 결제 정보에 대한 fetch가 시작된다.
      setConfirmData({
        amount: parseInt(query?.amount as string),
        orderId: query.orderId as string,
        paymentKey: query?.paymentKey as string,
      });
    } else {
      // 금액이 일치하지 않을 경우
      updateOrderData({
        orderId: orderData?.orderId,
        orderData: { status: "Payment failed" },
      });

      replace("/purchase/fail?status=amountdonotmatch", undefined, {
        shallow: true,
      });
    }
  }, [
    orderData,
    query.amount,
    query.orderId,
    query?.paymentKey,
    replace,
    updateOrderData,
  ]);

  // 결제 승인 요청 결과 처리
  useEffect(() => {
    // 주문 데이터가 없거나 이미 프로세스가 완료된 경우, 혹은 결제 정보가 요청되기 전이면 리턴
    if (!orderData || processComplete || !paymentFetched || !confirmData)
      return;

    // 결제 데이터 fetch에 성공한 경우 (결제 성공 시)
    if (paymentData) {
      // 주문 정보 업데이트(상태 업데이트, 결제 정보 추가)
      updateOrderData({
        orderId: orderData?.orderId,
        orderData: { payment: paymentData, status: "Payment completed" },
      });

      // 재고 수량 업데이트
      updateStock({
        cart: orderData?.products,
        amount: parseInt(query.amount as string),
      });

      // 장바구니 or 임시카트 비우기
      if (query.target === "cart") {
        clearCart.mutate(orderData.uid);
      } else {
        sessionStorage.removeItem("tempCart");
      }

      // 결제 데이터 fetch에 실패한 경우 (결제 실패 시)
    } else if (!paymentData) {
      updateOrderData({
        orderId: orderData?.orderId,
        orderData: {
          status: "Payment failed",
          payment: { error: JSON.stringify(fetchError) },
        },
      });

      replace("/purchase/fail", undefined, { shallow: true });
    }

    // 결제 프로세스 완료
    setProcessComplete(true);
  }, [
    clearCart,
    confirmData,
    fetchError,
    orderData,
    paymentData,
    paymentFetched,
    processComplete,
    query.amount,
    query.target,
    replace,
    updateOrderData,
    updateStock,
  ]);

  // 결제 실패
  useEffect(() => {
    if (orderDataFail) {
      replace("/purchase/fail?status=badrequest", undefined, { shallow: true });
    }
  }, [orderDataFail, replace]);

  return (
    <main className="page-container flex flex-col">
      <Seo title="PURCHASE" />
      <HeaderBasic
        title={{
          text:
            processComplete && paymentData ? "주문 완료" : "결제 확인 중...",
        }}
        toHome={true}
      />
      <section className="relative flex grow items-center justify-center px-12 xs:px-5">
        {processComplete && paymentData ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center pb-12 pr-5">
            <div className="sm:w-[60%]">
              <Done show={true} />
            </div>
            <p className="pl-5 text-3xl font-bold text-zinc-800">
              주문이 완료되었습니다.
            </p>
          </div>
        ) : (
          <div className="flex min-h-[300px] w-full flex-col items-center justify-center text-center">
            <Loading show={true} />
          </div>
        )}
      </section>
    </main>
  );
};

export default PurchaseSuccess;

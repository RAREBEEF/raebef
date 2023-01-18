import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderBasic from "../../components/HeaderBasic";
import useGetOrderData from "../../hooks/useGetOrderData";
import useConfirmPayment from "../../hooks/useConfirmPayment";
import { ConfirmPaymentData } from "../../types";
import useUpdateOrderData from "../../hooks/useUpdateOrderData";
import useUpdateStock from "../../hooks/useUpdateStock";
import useCart from "../../hooks/useCart";
import Loading from "../../components/AnimtaionLoading";
import Done from "../../components/AnimationDone";

const PurchaseSuccess = () => {
  const router = useRouter();
  const [confirmData, setConfirmData] = useState<ConfirmPaymentData | null>(
    null
  );
  const { mutate: updateOrderData } = useUpdateOrderData();
  const { data: paymentData, isFetched: paymentFetched } =
    useConfirmPayment(confirmData);
  const { mutate: updateStock } = useUpdateStock();
  const { clear: clearCart } = useCart();
  const { data: orderData, isError: orderDataFail } = useGetOrderData(
    (router?.query?.orderId as string) || ""
  );
  const [processComplete, setProcessComplete] = useState<boolean>(false);

  useEffect(() => {
    if (orderDataFail) router.replace("/purchase/fail?status=badrequest");
  }, [orderDataFail, router]);

  useEffect(() => {
    // 주문 데이터와 결제 금액이 없으면 리턴
    if (!orderData || !router.query.amount) return;

    // 주문과 실결제 금액이 일치하는지 확인 후
    if (orderData.amount === parseInt(router.query.amount as string)) {
      // 결제 정보 확인 데이터를 상태에 업데이트
      // 결제 확인 데이터가 업데이트되면 결제 정보에 대한 fetch가 시작된다.
      setConfirmData({
        amount: parseInt(router?.query?.amount as string),
        orderId: router.query.orderId as string,
        paymentKey: router?.query?.paymentKey as string,
      });
    } else {
      // 금액이 일치하지 않을 경우
      updateOrderData({
        orderId: orderData?.orderId,
        status: "Payment failed",
      });
      router.replace("/purchase/fail?status=amountdonotmatch");
    }
  }, [
    orderData,
    router,
    router.query.amount,
    router.query.orderId,
    router.query?.paymentKey,
    updateOrderData,
  ]);

  // 결제 결과 처리
  useEffect(() => {
    // 주문 데이터가 없거나 이미 프로세스가 완료된 경우, 혹은 결제 정보가 요청되기 전이면 리턴
    if (!orderData || processComplete || !paymentFetched || !confirmData)
      return;

    // 결제 데이터 fetch에 성공한 경우 (결제 성공 시)
    if (paymentData) {
      // 주문 정보 업데이트(상태 업데이트, 결제 정보 추가)
      updateOrderData({
        orderId: orderData?.orderId,
        status: "Payment completed",
        paymentData,
      });

      // 재고 수량 업데이트
      updateStock({ cart: orderData?.products });

      // 장바구니 or 임시카트 비우기
      if (router.query.target === "cart") {
        clearCart.mutate(orderData.uid);
      } else {
        sessionStorage.removeItem("tempCart");
      }

      // 결제 데이터 fetch에 실패한 경우 (결제 실패 시)
    } else if (!paymentData) {
      updateOrderData({
        orderId: orderData?.orderId,
        status: "Payment failed",
      });

      router.replace("/purchase/fail");
    }

    // 결제 프로세스 완료
    setProcessComplete(true);
  }, [
    clearCart,
    confirmData,
    orderData,
    paymentData,
    paymentFetched,
    processComplete,
    router,
    updateOrderData,
    updateStock,
  ]);

  // // 타이머;
  // useEffect(() => {
  //   const confirmDataTimer = setTimeout(() => {
  //     // 필수 파라미터가 없을 경우
  //     if (
  //       !(
  //         router.query.orderId &&
  //         router.query.paymentKey &&
  //         router.query.amount &&
  //         router.query.target
  //       )
  //     ) {
  //       router.replace("/purchase/fail?status=badrequest");
  //     }
  //   }, 3000);

  //   const timer = setTimeout(() => {
  //     // orderData가 없을 경우
  //     if (!orderData) {
  //       router.replace("/purchase/fail?status=timeout");
  //       // paymentData가 없을 경우
  //     } else if (!paymentData) {
  //       updateOrderData({
  //         orderId: orderData?.orderId,
  //         status: "Payment failed",
  //       });
  //       router.replace("/purchase/fail?status=timeout");
  //     }
  //   }, 30000);

  //   return () => {
  //     clearTimeout(confirmDataTimer);
  //     clearTimeout(timer);
  //   };
  // }, [confirmData, orderData, paymentData, router, updateOrderData]);

  return (
    <main className="page-container">
      <HeaderBasic
        title={{
          text:
            processComplete && paymentData ? "주문 완료" : "결제 확인 중...",
        }}
        parent={{ text: "제품 구매" }}
      />
      <section className="relative px-12 xs:px-5">
        {processComplete && paymentData ? (
          <div className="h-[50vh] min-h-[300px] flex flex-col justify-center items-center pb-12 pr-5">
            <div className="sm:w-[60%]">
              <Done show={true} />
            </div>
            <p className="text-zinc-800 font-bold text-3xl pl-5">
              주문이 완료되었습니다.
            </p>
          </div>
        ) : (
          <div className="w-full h-[50vh] min-h-[300px] text-center">
            <Loading show={true} />
          </div>
        )}
      </section>
    </main>
  );
};

export default PurchaseSuccess;

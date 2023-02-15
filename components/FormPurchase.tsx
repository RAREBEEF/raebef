import Button from "./Button";
import {
  loadTossPayments,
  TossPaymentsInstance,
} from "@tosspayments/payment-sdk";
import { FormEvent, useEffect, useState } from "react";
import FormAddress from "./FormAddress";
import { AddressType, CartType, OrderData, UserData } from "../types";
import { v4 as uuidv4 } from "uuid";
import CartItemList from "./CartItemList";
import useGetProductsFromCart from "../hooks/useGetProductsFromCart";
import useCartSummary from "../hooks/useCartSummary";
import useInput from "../hooks/useInput";
import useCheckCartStock from "../hooks/useCheckCartStock";
import SkeletonCart from "./SkeletonCart";
import useOrderData from "../hooks/useOrderData";

interface Props {
  userData: UserData;
  cart: CartType;
  target: string;
}

const FormPurchase: React.FC<Props> = ({ userData, cart, target }) => {
  const checkCartStock = useCheckCartStock();
  const [sameAsOrderer, setSameAsOrderer] = useState<boolean>(true);
  const [addressData, setAddressData] = useState<AddressType | null>(
    userData.addressData
  );
  const [tossPayments, setTossPayments] = useState<TossPaymentsInstance | null>(
    null
  );
  const {
    value: ordererName,
    setValue: setOrdererName,
    onChange: onOrdererNameChange,
  } = useInput(userData.user?.displayName || "");
  const {
    value: shippingRequest,
    setValue: setShippingRequest,
    onChange: onShippingRequestChange,
  } = useInput("");
  const {
    value: recipientName,
    setValue: setRecipientName,
    onChange: onRecipientNameChange,
  } = useInput("");
  const { data: productsData } = useGetProductsFromCart(Object.keys(cart));
  const {
    add: { mutateAsync: addOrderData },
    update: { mutateAsync: updateOrderData },
  } = useOrderData("");
  const cartSummary = useCartSummary(userData, cart, productsData || null);
  const onSameAsOrdererChange = () => {
    setSameAsOrderer((prev) => !prev);
  };

  const onPurchase = (e: FormEvent) => {
    e.preventDefault();

    if (!addressData) {
      window.alert("주소를 입력해주세요.");
      return;
    } else if (!ordererName) {
      window.alert("주문자 성명을 입력해주세요.");
      return;
    } else if (!productsData || !cartSummary || !userData?.user?.uid) {
      window.alert("잘못된 주문 요청입니다.");
      return;
    }

    let orderName = `${productsData[Object.keys(productsData)[0]]?.name}${
      Object.keys(productsData).length >= 2
        ? " 외 " + (Object.keys(productsData).length - 1) + "건"
        : ""
    }`;

    const orderData: OrderData = {
      amount: cartSummary.totalPrice,
      orderId: uuidv4(),
      uid: userData.user.uid,
      orderName,
      recipientName: sameAsOrderer
        ? (userData.user.displayName as string)
        : recipientName,
      addressData,
      customerName: userData.user.displayName as string,
      status: "Payment in progress",
      products: cart,
      shippingRequest,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };

    if (!checkCartStock(productsData, cart)) {
      window.alert("이미 품절된 상품이 포함되어 있습니다.");
      return;
    } else {
      addOrderData({ orderId: orderData.orderId, orderData }).then(() => {
        tossPayments
          ?.requestPayment("카드", {
            ...orderData,
            successUrl: `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/purchase/success?target=${target}`,
            failUrl: `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/purchase/fail`,
          })
          .catch((error) => {
            console.log(error);
            updateOrderData({
              orderId: orderData.orderId,
              orderData: {
                status:
                  error.code === "USER_CANCEL"
                    ? "Payment cancelled"
                    : "Payment failed",
                error: JSON.stringify(error),
              },
            });
          });
      });
    }
  };

  useEffect(() => {
    if (!userData?.user?.uid) return;

    loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string).then(
      (tossPayments) => {
        setTossPayments(tossPayments);
      }
    );
  }, [userData]);

  return (
    <form
      className="flex flex-col gap-5 text-zinc-800 text-base"
      onSubmit={onPurchase}
    >
      {productsData && cartSummary ? (
        <CartItemList
          cartSummary={{
            ...cartSummary,
            totalPrice: cartSummary.totalPrice,
          }}
          productsData={productsData}
          cart={cart}
          userData={userData}
          withoutDeleteBtn={true}
        />
      ) : (
        <SkeletonCart withoutDeleteBtn={true} />
      )}
      <section className="flex flex-col gap-10">
        <label className="w-fit">
          <h3 className="text-xl font-semibold">* 주문자</h3>
          <input
            type="text"
            placeholder={userData.user?.displayName || "주문자 성명"}
            value={ordererName}
            onChange={onOrdererNameChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className="h-8 px-2 pt-1 pb-1 mt-2"
          />
        </label>
        <label className="w-fit">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-semibold">수령인</h3>
            <label>
              <input
                type="checkbox"
                checked={sameAsOrderer}
                onChange={onSameAsOrdererChange}
                value="sameAsOrderer"
              />{" "}
              주문자와 동일
            </label>
          </div>

          <input
            type="text"
            placeholder={"수령인 성명"}
            value={sameAsOrderer ? ordererName : recipientName}
            onChange={(e) => {
              setSameAsOrderer(false);
              onRecipientNameChange(e);
            }}
            required
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className="h-8 px-2 pt-1 pb-1 mt-2"
          />
        </label>
        <div>
          <h3 className="text-xl font-semibold mb-3">* 배송 주소</h3>
          <FormAddress
            addressData={addressData}
            setAddressData={setAddressData}
          />
        </div>
        <label className="w-fit">
          <h3 className="text-xl font-semibold">배송 요청 사항</h3>
          <input
            type="text"
            placeholder={""}
            value={shippingRequest}
            onChange={onShippingRequestChange}
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className="h-8 px-2 pt-1 pb-1 mt-2"
          />
        </label>
      </section>
      <div className="text-center mt-12">
        <Button
          disabled={!userData || !cartSummary || cartSummary.invalidProduct}
          theme="black"
          tailwindStyles="px-8"
        >
          {cartSummary?.totalPrice.toLocaleString("ko-KR") || "-"}원 결제하기
        </Button>
        <p className="text-zinc-500 font-semibold text-sm my-2 break-keep">
          토스 페이먼츠 api를 이용한 테스트 결제입니다.
          <br />
          실제 결제되지 않으며 빈 계좌를 이용하여도 결제 테스트가 가능합니다.
        </p>
      </div>
    </form>
  );
};

export default FormPurchase;

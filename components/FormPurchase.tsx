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
  const { value: ordererName, onChange: onOrdererNameChange } = useInput(
    userData.user?.displayName || ""
  );
  const { value: shippingRequest, onChange: onShippingRequestChange } =
    useInput("");
  const { value: recipientName, onChange: onRecipientNameChange } =
    useInput("");
  const { data: productsData } = useGetProductsFromCart(Object.keys(cart));
  const {
    add: { mutateAsync: addOrderData },
    update: { mutateAsync: updateOrderData },
  } = useOrderData("");
  const cartSummary = useCartSummary(userData, cart, productsData || null);

  const onSameAsOrdererChange = () => {
    setSameAsOrderer((prev) => !prev);
  };

  const onPurchase = async (e: FormEvent) => {
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

    console.log(orderData);

    if (!checkCartStock(productsData, cart)) {
      window.alert("이미 품절된 상품이 포함되어 있습니다.");
      return;
    } else {
      if (!tossPayments) return;
      addOrderData({ orderId: orderData.orderId, orderData }).then(() => {
        tossPayments
          .requestPayment("카드", {
            amount: orderData.amount,
            orderId: orderData.orderId,
            orderName: orderData.orderName,
            customerName: orderData.customerName,
            successUrl: `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/purchase/success?target=${target}`,
            failUrl: `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/purchase/fail`,
          })
          .catch((error) => {
            console.error(error);
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

    loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string)
      .then((tossPayments) => {
        setTossPayments(tossPayments);
      })
      .catch((error) => console.log(error));
  }, [userData]);

  return (
    <form
      className="flex flex-col gap-5 text-base text-zinc-800"
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
            className="mt-2 h-8 px-2 pt-1 pb-1"
          />
        </label>
        <label className="w-fit">
          <div className="flex flex-wrap items-center gap-3">
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
            className="mt-2 h-8 px-2 pt-1 pb-1"
          />
        </label>
        <div>
          <h3 className="mb-3 text-xl font-semibold">* 배송 주소</h3>
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
            className="mt-2 h-8 px-2 pt-1 pb-1"
          />
        </label>
      </section>
      <div className="mt-12 text-center">
        <Button
          disabled={!userData || !cartSummary || cartSummary.invalidProduct}
          theme="black"
          tailwindStyles="px-8"
        >
          {cartSummary?.totalPrice.toLocaleString("ko-KR") || "-"}원 결제하기
        </Button>
        <p className="my-2 break-keep text-sm font-semibold text-zinc-500">
          토스 페이먼츠 api를 이용한 테스트 결제입니다.
          <br />
          실제 결제되지 않으며 빈 계좌를 이용하여도 결제 테스트가 가능합니다.
        </p>
      </div>
    </form>
  );
};

export default FormPurchase;

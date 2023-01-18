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
import useGetCartProducts from "../hooks/useGetCartProducts";
import useCartSummary from "../hooks/useCartSummary";
import useInput from "../hooks/useInput";
import useCheckCartStock from "../hooks/useCheckCartStock";
import useAddOrderData from "../hooks/useAddOrderData";
import SkeletonCart from "./SkeletonCart";

interface Props {
  userData: UserData;
  cart: CartType;
  target: string;
}

const CLIENT_KEY = "test_ck_jkYG57Eba3GYZBOZGb5rpWDOxmA1";

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
    value: recipientName,
    setValue: setRecipientName,
    onChange: onRecipientNameChange,
  } = useInput("");
  const { data: productsData } = useGetCartProducts(Object.keys(cart));
  const { mutateAsync: addOrderData } = useAddOrderData();
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

    let orderName = `${productsData[Object.keys(productsData)[0]].name}${
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
    };

    if (!checkCartStock(productsData, cart)) {
      window.alert("이미 품절된 상품이 포함되어 있습니다.");
      return;
    } else {
      addOrderData(orderData).then(() => {
        tossPayments?.requestPayment("카드", {
          ...orderData,
          successUrl: `https://localhost:3001/purchase/success?target=${target}`,
          failUrl: "https://localhost:3001/purchase/fail",
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
          cartSummary={cartSummary}
          productsData={productsData}
          cart={cart}
          userData={userData}
          withoutAction={true}
        />
      ) : (
        <SkeletonCart withoutAction={true} />
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
      </section>
      <div className="text-center mt-12">
        <Button
          disabled={!userData || !cartSummary}
          theme="black"
          tailwindStyles="px-8"
        >
          {cartSummary?.totalPrice.toLocaleString("ko-KR") || "-"}원 결제하기
        </Button>
        <p className="text-zinc-500 font-semibold text-sm mt-2">
          실제 결제되지 않는 테스트입니다.
        </p>
      </div>
    </form>
  );
};

export default FormPurchase;

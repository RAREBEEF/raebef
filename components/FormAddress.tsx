import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useState,
} from "react";
import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
import Button from "./Button";
import { AddressType } from "../types";

interface Props {
  addressData: AddressType | null;
  setAddressData: Dispatch<SetStateAction<AddressType | null>>;
}

const FormAddress: React.FC<Props> = ({ addressData, setAddressData }) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const onAdditionalAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { value } = e.target;
    setAddressData((prev) => ({
      address: prev?.address || "",
      postCode: prev?.postCode || "",
      additional: value,
    }));
  };

  const onAddressSearchToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSearch((prev) => !prev);
  };

  const onAddressSearchComplete = (data: Address) => {
    setAddressData({
      address: data.address || "",
      postCode: data.zonecode || "",
      additional: "",
    });

    setShowSearch(false);
  };

  const onAddressDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setAddressData(null);
  };

  return (
    <div>
      <div
        className={`mx-2 flex flex-col flex-wrap gap-2 ${
          !addressData && "text-zinc-500"
        }`}
      >
        <div className="flex gap-2">
          <Button onClick={onAddressSearchToggle} tailwindStyles="py-0 px-2">
            {showSearch ? "창 닫기" : "주소 검색"}
          </Button>
          {addressData && (
            <Button onClick={onAddressDelete} tailwindStyles="py-0 px-2">
              지우기
            </Button>
          )}
        </div>
        <DaumPostcodeEmbed
          style={{
            height: showSearch ? "500px" : "0px",
            border: showSearch ? "1px solid #71717a" : "none",
            borderRadius: "15px",
            overflow: "hidden",
          }}
          onComplete={onAddressSearchComplete}
          autoClose={false}
        />
        <div className="flex flex-col gap-2">
          <span>
            {addressData?.address
              ? `(${addressData?.postCode})`
              : addressData
              ? `(${addressData.postCode})`
              : ""}{" "}
            {addressData?.address
              ? addressData?.address
              : addressData
              ? addressData.address
              : "검색된 주소 없음"}
          </span>
          {addressData && (
            <input
              placeholder="추가 주소"
              value={addressData?.additional || ""}
              onChange={onAdditionalAddressChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="h-8 w-[200px] px-2 pt-1 pb-1"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormAddress;

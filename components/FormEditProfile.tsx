import { useRouter } from "next/router";
import {
  Dispatch,
  FormEvent,
  MouseEvent,
  SetStateAction,
  useState,
} from "react";
import { UseMutateFunction } from "react-query";
import useInput from "../hooks/useInput";
import { AddressType, UserData } from "../types";
import Button from "./Button";
import FormAddress from "./FormAddress";

interface Props {
  userData: UserData | null;
  editProfile: UseMutateFunction<
    void,
    unknown,
    {
      name: string;
      addressData?: AddressType | null;
      phoneNumber?: string | null;
    },
    unknown
  >;
}

const FormEditProfile: React.FC<Props> = ({ userData, editProfile }) => {
  const { query, push } = useRouter();
  const [addressData, setAddressData] = useState<AddressType | null>(
    userData?.addressData || null
  );
  const [alert, setAlert] = useState<string>("");
  const { value: name, onChange: onNameChange } = useInput(
    userData?.user?.displayName || ""
  );
  const { value: phoneNumber, onChange: onPhoneNumberChange } = useInput(
    userData?.phoneNumber || ""
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      setAlert("이름을 입력해주세요.");
      return;
    }

    const newProfile = {
      name: name as string,
      phoneNumber,
      addressData,
    };

    editProfile(newProfile);

    push({ query: { tab: "profile" } });
  };

  return (
    <form
      className="flex flex-col gap-10 text-zinc-800 text-base"
      onSubmit={onSubmit}
    >
      <label>
        <h3 className="text-xl font-semibold">* 이름</h3>
        <input
          type="text"
          value={name || ""}
          onChange={onNameChange}
          placeholder={userData?.user?.displayName || "이름"}
          required
          style={{
            borderBottom: "1px solid #1f2937",
          }}
          className="h-8 px-2 pt-1 pb-1 mt-2"
        />
      </label>
      <label>
        <h3 className="text-xl font-semibold">전화번호</h3>
        <input
          type="text"
          value={phoneNumber || ""}
          onChange={onPhoneNumberChange}
          placeholder={userData?.phoneNumber || ""}
          style={{
            borderBottom: "1px solid #1f2937",
          }}
          className="h-8 px-2 pt-1 pb-1 mt-2"
        />
      </label>
      <div>
        <h3 className="text-xl font-semibold mb-3">기본 배송 주소</h3>
        <FormAddress
          addressData={addressData}
          setAddressData={setAddressData}
        />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <p className="h-6 w-full text-red-700 text-sm">{alert}</p>
        <Button theme="black">수정 완료</Button>
        <Button href={{ query: { tab: "profile" } }}>취소</Button>
      </div>
    </form>
  );
};

export default FormEditProfile;

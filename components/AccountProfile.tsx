import { MouseEvent, useState } from "react";
import useEditProfile from "../hooks/useEditProfile";
import { AddressType, UserData } from "../types";
import Button from "./Button";
import FormEditProfile from "./FormEditProfile";
import Loading from "./AnimtaionLoading";

interface Props {
  userData: UserData;
}

const AccountProfile: React.FC<Props> = ({ userData }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const { mutate: editProfile, isLoading } = useEditProfile();

  const [displayUserData, setDisplayUserData] = useState<{
    name: string | null;
    phoneNumber: string | null;
    addressData: AddressType | null;
  }>({
    name: userData.user?.displayName || null,
    phoneNumber: userData.phoneNumber || null,
    addressData: userData.addressData || null,
  });

  const onEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditMode(true);
  };

  return (
    <section className="px-5">
      <div>
        {editMode ? (
          <FormEditProfile
            userData={userData}
            editProfile={editProfile}
            setDisplayUserData={setDisplayUserData}
            setEditMode={setEditMode}
          />
        ) : (
          <div className="flex flex-col gap-10 text-zinc-800 text-base">
            <div>
              <h3 className="text-xl font-semibold">이름</h3>
              <div className="h-8 px-2 pt-1 pb-1 mt-2">
                {displayUserData.name}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">전화번호</h3>
              <div
                className={`h-8 px-2 pt-1 pb-1 mt-2 ${
                  !userData.phoneNumber && "text-zinc-500"
                }`}
              >
                {displayUserData.phoneNumber || "등록된 전화번호 없음"}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">기본 배송 주소</h3>
              <div
                className={`h-8 px-2 pt-1 pb-1 mt-2 ${
                  !userData.addressData && "text-zinc-500"
                }`}
              >
                {displayUserData.addressData ? (
                  <div>
                    <div className="mb-1">
                      ({displayUserData.addressData.postCode}){" "}
                      {displayUserData.addressData.address}
                    </div>
                    <div>({displayUserData.addressData.additional})</div>
                  </div>
                ) : (
                  "등록된 주소 없음"
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <p className="h-6 w-full text-red-700 text-sm"></p>
              <Button theme="black" onClick={onEditClick}>
                정보 수정
              </Button>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-5 mt-16">
          <Button>비밀번호 재설정</Button>
          <Button theme="red">계정 탈퇴</Button>
        </div>
      </div>
      <Loading show={isLoading} fullScreen={true} />
    </section>
  );
};

export default AccountProfile;

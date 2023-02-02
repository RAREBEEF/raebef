import Button from "./Button";
import FormEditProfile from "./FormEditProfile";
import Loading from "./AnimtaionLoading";
import useGetUserData from "../hooks/useGetUserData";
import useAccount from "../hooks/useAccount";
import { useRouter } from "next/router";

const AccountProfile = () => {
  const { query } = useRouter();
  const { data: userData } = useGetUserData();
  const {
    editProfile: { mutate: editProfile, isLoading },
  } = useAccount();

  return (
    <section className="px-5">
      <div>
        {query.edit === "true" ? (
          <FormEditProfile
            userData={userData || null}
            editProfile={editProfile}
          />
        ) : (
          <div className="flex flex-col gap-10 text-zinc-800 text-base">
            <div>
              <h3 className="text-xl font-semibold">이름</h3>
              <div className="h-8 px-2 pt-1 pb-1 mt-2">
                {userData?.user?.displayName}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">전화번호</h3>
              <div
                className={`h-8 px-2 pt-1 pb-1 mt-2 ${
                  !userData?.phoneNumber && "text-zinc-500"
                }`}
              >
                {userData?.phoneNumber || "등록된 전화번호 없음"}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">기본 배송 주소</h3>
              <div
                className={`h-8 px-2 pt-1 pb-1 mt-2 ${
                  !userData?.addressData && "text-zinc-500"
                }`}
              >
                {userData?.addressData ? (
                  <div>
                    <div className="mb-1">
                      ({userData.addressData.postCode}){" "}
                      {userData.addressData.address}
                    </div>
                    <div>({userData.addressData.additional})</div>
                  </div>
                ) : (
                  "등록된 주소 없음"
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <p className="h-6 w-full text-red-700 text-sm"></p>
              <Button
                theme="black"
                href={{ query: { ...query, edit: "true" } }}
              >
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

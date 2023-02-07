import Button from "./Button";
import FormEditProfile from "./FormEditProfile";
import Loading from "./AnimtaionLoading";
import useGetUserData from "../hooks/useGetUserData";
import { useRouter } from "next/router";
import useIsAdmin from "../hooks/useIsAdmin";
import useAccount from "../hooks/useAccount";
import { MouseEvent } from "react";

const AccountProfile = () => {
  const { query } = useRouter();
  const { data: userData } = useGetUserData();
  const isAdmin = useIsAdmin(userData);
  const {
    editProfile: { mutateAsync: editProfile, isLoading },
    deleteAccount: { mutateAsync: deleteAccount },
    changePw,
  } = useAccount();

  const onDeleteAccount = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userData?.isAdmin || userData?.isTestAccount) {
      window.alert("테스트 계정은 탈퇴할 수 없습니다.");
    } else {
      window.confirm("계정을 삭제하시겠습니까?") &&
        deleteAccount(userData?.user?.uid);
    }
  };

  const onResetPw = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userData?.isAdmin || userData?.isTestAccount) {
      window.alert("테스트 계정의 비밀번호는 변경할 수 없습니다.");
    } else {
      changePw()
        .then(() => {
          window.alert("재설정 메일이 발송되었습니다.");
        })
        .catch((error) => {
          console.error(error);
          window.alert(
            "재설정 메일을 발송하는 과정에서 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
          );
        });
    }
  };

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
          {isAdmin && (
            <Button href="/admin" theme="black">
              관리자 메뉴로
            </Button>
          )}
          <Button onClick={onResetPw}>비밀번호 재설정</Button>
          <Button onClick={onDeleteAccount} theme="red">
            계정 탈퇴
          </Button>
        </div>
      </div>
      <Loading show={isLoading} fullScreen={true} />
    </section>
  );
};

export default AccountProfile;

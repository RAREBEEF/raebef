import { useRouter } from "next/router";
import React, { MouseEvent } from "react";
import Button from "../components/Button";
import HeaderBasic from "../components/HeaderBasic";
import Loading from "../components/AnimtaionLoading";
import useAccount from "../hooks/useAccount";
import FormResetPw from "../components/FormResetPw";
import Seo from "../components/Seo";

const PasswordReset = () => {
  const { push, query } = useRouter();
  const {
    login: { mutateAsync: login, isLoading },
  } = useAccount();

  const onGoogleLoginClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    login({ provider: "google" })
      .then(() => {
        const fromPath = query.from as string;

        if (fromPath) {
          push(fromPath);
        } else {
          push("/");
        }
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            console.log("팝업이 닫혀 구글 계정 로그인이 중단 되었습니다.");
            console.error(error);
            break;
          default:
            console.error(error);
        }
      });
  };

  return (
    <React.Fragment>
      <main className="page-container">
        <Seo title="RESET PASSWORD" />
        <HeaderBasic title={{ text: "비밀번호 재설정" }} />
        <section className="flex flex-wrap justify-evenly gap-x-24 gap-y-10 px-12 pb-24 md:flex-col xs:px-5">
          <FormResetPw />
          <div className="flex min-w-[150px] max-w-[450px] grow flex-col gap-10 text-zinc-800 md:max-w-full">
            <section>
              <h3 className="pb-5 text-xl font-semibold">계정이 있으신가요?</h3>
              <Button href="/login" theme="black">
                기존 계정으로 로그인하기
              </Button>
            </section>
            <section>
              <h3 className="pb-5 text-xl font-semibold">
                소셜 계정으로 이용하기
              </h3>
              <Button theme="black" onClick={onGoogleLoginClick}>
                구글 계정으로 계속하기
              </Button>
            </section>
          </div>
        </section>
      </main>
      <Loading show={isLoading} fullScreen={true} />
    </React.Fragment>
  );
};

export default PasswordReset;

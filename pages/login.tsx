import { useRouter } from "next/router";
import React, { MouseEvent } from "react";
import Button from "../components/Button";
import Loading from "../components/AnimtaionLoading";
import LoginForm from "../components/FormLogin";
import HeaderBasic from "../components/HeaderBasic";
import useAccount from "../hooks/useAccount";
import Seo from "../components/Seo";

const Login = () => {
  const { query, push } = useRouter();
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
        <Seo title="LOGIN" />
        <HeaderBasic title={{ text: "로그인" }} />
        <section className="flex px-12 xs:px-5 justify-evenly gap-x-24 gap-y-10 md:flex-col">
          <LoginForm />
          <section className="flex flex-col gap-10 grow max-w-[450px] min-w-[150px] text-zinc-800 md:max-w-full">
            <div>
              <h3 className="text-xl font-semibold pb-5">계정이 없으신가요?</h3>
              <Button href="/register" theme="black">
                계정 등록하기
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold pb-5">
                소셜 계정으로 이용하기
              </h3>
              <Button theme="black" onClick={onGoogleLoginClick}>
                구글 계정으로 계속하기
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold pb-5">
                로그인에 문제가 있으신가요?
              </h3>
              <Button theme="black" href="/pwreset">
                비밀번호 재설정하기
              </Button>
            </div>
          </section>
        </section>
      </main>
      <Loading show={isLoading} fullScreen={true} />
    </React.Fragment>
  );
};

export default Login;

import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import React, { MouseEvent } from "react";
import Button from "../components/Button";
import Loading from "../components/Loading";
import LoginForm from "../components/LoginForm";
import PageHeader from "../components/PageHeader";
import useGoogleLogin from "../hooks/useGoogleLogin";
import googleLogin from "./api/googleLogin";

const Login = () => {
  const router = useRouter();

  const googleLoginErrorHandler = (error: FirebaseError) => {
    switch (error.code) {
      case "auth/popup-closed-by-user":
        console.log("팝업이 닫혀 구글 계정 로그인이 중단 되었습니다.");
        console.error(error);
        break;
      default:
        console.error(error);
    }
  };
  const onGoogleLoginSuccess = () => {
    router.push("/");
  };

  const { mutate, isLoading } = useGoogleLogin(
    googleLoginErrorHandler,
    onGoogleLoginSuccess
  );

  const onGoogleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <React.Fragment>
      <main className="page-container">
        <PageHeader title={{ text: "로그인" }} parent={{ text: "계정" }} />
        <section className="flex px-12 xs:px-5 justify-evenly gap-x-24 gap-y-10 flex-wrap md:flex-col">
          <LoginForm />
          <div className="flex flex-col gap-10 grow max-w-[450px] min-w-[150px] text-zinc-800 md:max-w-full">
            <section>
              <h3 className="text-xl font-semibold pb-5">계정이 없으신가요?</h3>
              <Button href="/register" theme="black">
                계정 등록하기
              </Button>
            </section>
            <section>
              <h3 className="text-xl font-semibold pb-5">
                소셜 계정으로 이용하기
              </h3>
              <Button theme="black" onClick={onGoogleLoginClick}>
                구글 계정으로 계속하기
              </Button>
            </section>
          </div>
        </section>
      </main>
      <Loading show={isLoading} />
    </React.Fragment>
  );
};

export default Login;

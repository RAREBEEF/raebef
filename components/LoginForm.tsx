import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import useAuthErrorAlert from "../hooks/useAuthErrorAlert";
import useEmailLogin from "../hooks/useEmailLogin";
import useEmailValidCheck from "../hooks/useEmailValidCheck";
import useInput from "../hooks/useInput";
import Button from "./Button";
import Loading from "./Loading";

const LoginForm = () => {
  const router = useRouter();
  const emailValidCheck = useEmailValidCheck();
  const authErrorAlert = useAuthErrorAlert();
  const [alert, setAlert] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const {
    value: email,
    setValue: setEmail,
    onChange: onEmailChange,
  } = useInput("");
  const {
    value: password,
    setValue: setPassword,
    onChange: onPasswordChange,
  } = useInput("");

  const errorHandler = (error: FirebaseError) => {
    setAlert("* " + authErrorAlert(error.code));
  };

  const onSuccess = () => {
    const fromPath = router.query.from as string;

    if (fromPath) {
      router.push(fromPath);
    } else {
      router.push("/");
    }
  };

  const { mutate, isLoading } = useEmailLogin(errorHandler, onSuccess);

  // 유효성 검증
  useEffect(() => {
    setIsEmailValid(emailValidCheck(email));
    setIsPasswordValid(password.length >= 6);
  }, [email, emailValidCheck, password]);

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <React.Fragment>
      <form
        onSubmit={onLogin}
        className="text-zinc-800 text-sm grow max-w-[450px] min-w-[150px] md:max-w-full"
      >
        <h3 className="text-xl font-semibold pb-5">로그인</h3>
        <section className="flex flex-col gap-5">
          <input
            type="email"
            value={email}
            placeholder="이메일 *"
            onChange={onEmailChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
              borderColor:
                (!isEmailValid && email) || (!email && password)
                  ? "#b91c1c"
                  : "#1f2937",
            }}
            className={`px-2 pt-1 pb-2 ${
              password && "placeholder:text-[#b91c1c]"
            } ${!isEmailValid && email ? "text-[#b91c1c]" : "text-zinc-800"}`}
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            placeholder="비밀번호 *"
            onChange={onPasswordChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
              borderColor:
                (!isPasswordValid && password) || (!password && email)
                  ? "#b91c1c"
                  : "#1f2937",
            }}
            className={`px-2 pt-1 pb-2 ${
              email && "placeholder:text-[#b91c1c]"
            } ${
              !isPasswordValid && password ? "text-[#b91c1c]" : "text-zinc-800"
            }`}
            autoComplete="current-password"
          />
          <div className="flex justify-between gap-10">
            <p className="text-red-700 text-sm">{alert}</p>
            <Button
              theme="black"
              tailwindStyles="self-end px-10"
              disabled={
                !email || !password || !isPasswordValid || !isEmailValid
              }
            >
              로그인
            </Button>
          </div>
        </section>
      </form>
      <Loading show={isLoading} fullScreen={true} />
    </React.Fragment>
  );
};
export default LoginForm;

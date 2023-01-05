import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import React, { FormEvent, MouseEvent, useEffect, useState } from "react";
import { auth } from "../fb";
import useAuthErrorAlert from "../hooks/useAuthErrorAlert";
import useCreateEmailAccount from "../hooks/useCreateEmailAccount";
import useEditProfile from "../hooks/useEditProfile";
import useEmailValidCheck from "../hooks/useEmailValidCheck";
import useInput from "../hooks/useInput";
import Button from "./Button";
import Loading from "./Loading";

const RegisterForm = () => {
  const router = useRouter();
  const emailValidCheck = useEmailValidCheck();
  const authErrorAlert = useAuthErrorAlert();
  const [alert, setAlert] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const {
    value: lastName,
    setValue: setLastName,
    onChange: onLastNameChange,
  } = useInput("");
  const {
    value: firstName,
    setValue: setFirstName,
    onChange: onFirstNameChange,
  } = useInput("");
  const {
    value: email,
    setValue: setEmail,
    onChange: onEmailChange,
  } = useInput("");
  const {
    value: emailCheck,
    setValue: setEmailCheck,
    onChange: onEmailCheckChange,
  } = useInput("");
  const {
    value: password,
    setValue: setPassword,
    onChange: onPasswordChange,
  } = useInput("");
  const {
    value: passwordCheck,
    setValue: setPasswordCheck,
    onChange: onPasswordCheckChange,
  } = useInput("");

  const { mutate: editProfile } = useEditProfile();

  const errorHandler = (error: FirebaseError) => {
    setAlert(authErrorAlert(error.code));
  };

  const onSuccess = () => {
    try {
      editProfile({ firstName, lastName });
      window.alert("계정 등록이 완료되었습니다.");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: createAccount, isLoading } = useCreateEmailAccount(
    errorHandler,
    onSuccess
  );

  useEffect(() => {
    setIsEmailValid(emailValidCheck(email));
    setIsPasswordValid(password.length >= 6);
  }, [
    email,
    emailCheck,
    emailValidCheck,
    isEmailValid,
    isPasswordValid,
    password,
    passwordCheck,
  ]);

  const onRegister = (e: FormEvent) => {
    e.preventDefault();

    createAccount({ email, password });
  };

  return (
    <React.Fragment>
      <form
        onSubmit={onRegister}
        className="text-zinc-800 text-sm grow max-w-[450px] min-w-[150px] md:max-w-full"
      >
        <h3 className="text-xl font-semibold pb-5">계정 등록</h3>
        <section className="flex flex-col gap-5">
          <input
            type="text"
            value={firstName}
            placeholder="이름 *"
            onChange={onFirstNameChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className={`px-2 pt-1 pb-2 `}
          />
          <input
            type="text"
            value={lastName}
            placeholder="성 *"
            onChange={onLastNameChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className={`px-2 pt-1 pb-2 `}
          />
          <input
            type="email"
            value={email}
            placeholder="이메일 *"
            onChange={onEmailChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
              borderColor: !isEmailValid && email ? "#b91c1c" : "#1f2937",
            }}
            className={`px-2 pt-1 pb-2 ${
              !isEmailValid && email ? "text-[#b91c1c]" : "text-zinc-800"
            }`}
            autoComplete="email"
          />
          <input
            type="email"
            value={emailCheck}
            placeholder="이메일 확인 *"
            onChange={onEmailCheckChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
              borderColor:
                email && email !== emailCheck ? "#b91c1c" : "#1f2937",
            }}
            className={`px-2 pt-1 pb-2 ${
              email && "placeholder:text-[#b91c1c]"
            } ${email !== emailCheck ? "text-[#b91c1c]" : "text-zinc-800"}`}
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            placeholder="비밀번호 (6글자 이상) *"
            onChange={onPasswordChange}
            minLength={6}
            required
            style={{
              borderBottom: "1px solid #1f2937",
              borderColor: !isPasswordValid && password ? "#b91c1c" : "#1f2937",
            }}
            className={`px-2 pt-1 pb-2 ${
              !isPasswordValid && password ? "text-[#b91c1c]" : "text-zinc-800"
            }`}
            autoComplete="current-password"
          />
          <input
            type="password"
            value={passwordCheck}
            placeholder="비밀번호 확인 *"
            onChange={onPasswordCheckChange}
            required
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className={`px-2 pt-1 pb-2 ${
              password && "placeholder:text-[#b91c1c]"
            } ${
              password !== passwordCheck ? "text-[#b91c1c]" : "text-zinc-800"
            }`}
            autoComplete="current-password"
          />
          <div className="flex justify-between gap-10">
            <p className="text-red-700 text-sm">{alert}</p>
            <Button
              theme="black"
              tailwindStyles={`self-end px-10 ${
                firstName &&
                lastName &&
                isEmailValid &&
                email === emailCheck &&
                isPasswordValid &&
                password === passwordCheck
                  ? "pointer-events-auto"
                  : "pointer-events-none bg-zinc-100 text-zinc-200"
              }`}
            >
              등록하기
            </Button>
          </div>
        </section>
      </form>
      <Loading show={isLoading} />
    </React.Fragment>
  );
};

export default RegisterForm;

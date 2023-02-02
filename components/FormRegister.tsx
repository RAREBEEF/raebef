import { useRouter } from "next/router";
import { Fragment, FormEvent, useEffect, useState } from "react";
import useInput from "../hooks/useInput";
import Button from "./Button";
import Loading from "./AnimtaionLoading";
import useAccount from "../hooks/useAccount";

const FormRegister = () => {
  const { push } = useRouter();
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

  const {
    editProfile: { mutate: editProfile },
    createEmailAccount: { mutateAsync: createAccount, isLoading },
    authErrorAlert,
    emailValidCheck,
  } = useAccount();

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

  const onRegister = async (e: FormEvent) => {
    e.preventDefault();

    createAccount({ email, password })
      .then(() => {
        try {
          editProfile({ name: lastName + firstName });
          window.alert("계정 등록이 완료되었습니다.");

          push("/");
        } catch (error) {
          console.error(error);
        }
      })
      .catch((error) => {
        setAlert(authErrorAlert(error.code));
      });
  };

  return (
    <Fragment>
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
            className="px-2 pt-1 pb-2"
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
            className="px-2 pt-1 pb-2"
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
              tailwindStyles="self-end px-10"
              disabled={
                !firstName ||
                !lastName ||
                !isEmailValid ||
                email !== emailCheck ||
                !isPasswordValid ||
                password !== passwordCheck
              }
            >
              등록하기
            </Button>
          </div>
        </section>
      </form>
      <Loading show={isLoading} fullScreen={true} />
    </Fragment>
  );
};

export default FormRegister;

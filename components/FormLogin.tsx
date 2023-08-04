import { useRouter } from "next/router";
import { Fragment, FormEvent, useEffect, useState, useMemo } from "react";
import useInput from "../hooks/useInput";
import Button from "./Button";
import Loading from "./AnimtaionLoading";
import useAccount from "../hooks/useAccount";
import useGetUserData from "../hooks/useGetUserData";

const FormLogin = () => {
  const { query, replace } = useRouter();
  const [alert, setAlert] = useState<string>("");
  const { value: email, onChange: onEmailChange } = useInput("");
  const { value: password, onChange: onPasswordChange } = useInput("");
  const {
    login: { mutateAsync: login, isLoading },
    authErrorAlert,
    emailValidCheck,
  } = useAccount();
  const { refetch } = useGetUserData();
  const isEmailValid = useMemo(
    () => emailValidCheck(email),
    [email, emailValidCheck]
  );
  const isPasswordValid = useMemo(
    () => password.length >= 6,
    [password.length]
  );

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();

    await login({ provider: "email", email, password })
      .then(() => {
        refetch();
        const fromPath = query.from as string;
        if (fromPath) {
          replace(fromPath);
        } else {
          replace("/");
        }
      })
      .catch((error) => {
        setAlert("* " + authErrorAlert(error.code));
      });
  };

  return (
    <Fragment>
      <form
        onSubmit={onLogin}
        className="min-w-[150px] max-w-[450px] grow text-sm text-zinc-800 md:max-w-full"
      >
        <h3 className="pb-5 text-xl font-semibold">로그인</h3>
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
          <div className="flex flex-wrap justify-end gap-x-10 gap-y-5">
            <p className="grow text-start text-sm text-red-700">{alert}</p>
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
    </Fragment>
  );
};
export default FormLogin;

import { useRouter } from "next/router";
import { Fragment, FormEvent, useEffect, useState } from "react";
import useInput from "../hooks/useInput";
import Button from "./Button";
import useAccount from "../hooks/useAccount";

const FormResetPw = () => {
  const { push } = useRouter();
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const { value: email, onChange: onEmailChange } = useInput("");
  const { emailValidCheck, changePw } = useAccount();

  const onSendResetEmail = async (e: FormEvent) => {
    e.preventDefault();

    await changePw(email)
      .then(() => {
        window.alert("재설정 메일이 발송되었습니다.");
        push("/login");
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "auth/user-not-found") {
          const ok = window.confirm(
            "가입되지 않은 이메일입니다.\n회원가입 페이지로 이동하시겠습니까?"
          );
          if (ok) {
            push("/register");
          }
        } else {
          window.alert(
            "재설정 메일을 발송하는 과정에서 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
          );
        }
      });
  };

  useEffect(() => {
    setIsEmailValid(emailValidCheck(email));
  }, [email, emailValidCheck]);

  return (
    <Fragment>
      <form
        onSubmit={onSendResetEmail}
        className="min-w-[150px] max-w-[450px] grow text-sm text-zinc-800 md:max-w-full"
      >
        <h3 className="pb-5 text-xl font-semibold">재설정 메일 보내기</h3>
        <section className="flex flex-col gap-5">
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

          <div className="flex justify-between gap-10">
            <Button
              theme="black"
              tailwindStyles="self-end px-10"
              disabled={!isEmailValid}
            >
              메일 발송
            </Button>
          </div>
        </section>
      </form>
    </Fragment>
  );
};

export default FormResetPw;

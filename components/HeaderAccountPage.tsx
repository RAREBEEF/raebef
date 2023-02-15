import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import useAccount from "../hooks/useAccount";
import Button from "./Button";

interface Props {
  tab: string;
}

const HeaderAccountPage: React.FC<Props> = ({ tab }) => {
  const { replace } = useRouter();
  const {
    logout: { mutateAsync: logOut },
  } = useAccount();

  const onLogOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logOut().then(() => {
      replace("/login");
    });
  };

  return (
    <div className="bg-white relative mb-12 border-b text-zinc-800">
      <section className="relative px-12 py-5 flex justify-between font-bold md:pb-3 xs:px-5">
        <header className="text-3xl font-bold md:text-2xl xs:text-xl">
          <hgroup>
            <h1 className="text-lg text-zinc-500 md:text-base xs:text-sm">
              계정
            </h1>
            <h2 className="flex items-center gap-3">내 정보</h2>
          </hgroup>
        </header>
        <div>
          <Button
            theme="black"
            onClick={onLogOut}
            tailwindStyles="!py-1 !px-2 text-sm"
          >
            로그아웃
          </Button>
        </div>
      </section>

      <nav className="px-12 pb-5 text-lg md:text-base xs:px-5">
        <ul className="flex gap-5 flex-wrap">
          <li
            className={`px-1 transition-all
          ${tab === "profile" && "font-bold bg-zinc-800 text-zinc-50"}`}
          >
            <Link href="/account?tab=profile">프로필</Link>
          </li>
          <li
            className={`px-1 transition-all
          ${tab === "bookmark" && "font-bold bg-zinc-800 text-zinc-50"}`}
          >
            <Link href="/account?tab=bookmark">북마크</Link>
          </li>
          <li
            className={`px-1 transition-all
          ${tab === "orders" && "font-bold bg-zinc-800 text-zinc-50"}`}
          >
            <Link href="/account?tab=orders">주문 내역</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HeaderAccountPage;

import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import useAccount from "../hooks/useAccount";
import Button from "./Button";

interface Props {
  tab: string;
}

const HeaderAccountPage: React.FC<Props> = ({ tab }) => {
  const { replace, back } = useRouter();
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
    <div className="relative mb-12 border-b bg-white text-zinc-800">
      <section className="relative flex justify-between px-12 py-5 font-bold md:pb-3 xs:px-5">
        <header className="text-3xl font-bold md:text-2xl xs:text-xl">
          <nav className="text-lg text-zinc-500 md:text-base xs:text-sm">
            <button onClick={() => back()} className="group">
              <div className="flex gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 300 300"
                  className="my-auto w-[12px] stroke-zinc-500 transition-transform duration-500 group-hover:translate-x-[2px]"
                  style={{
                    rotate: "180deg",
                    fill: "none",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "50px",
                  }}
                >
                  <polyline points="78.79 267.02 222.75 150 78.79 32.98" />
                </svg>
                뒤로가기
              </div>
            </button>
          </nav>
          <h1 className="flex items-center gap-3">내 정보</h1>
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
        <ul className="flex flex-wrap gap-5">
          <li
            className={`px-1 transition-all
          ${tab === "profile" && "bg-zinc-800 font-bold text-zinc-50"}`}
          >
            <Link href="/account?tab=profile">프로필</Link>
          </li>
          <li
            className={`px-1 transition-all
          ${tab === "bookmark" && "bg-zinc-800 font-bold text-zinc-50"}`}
          >
            <Link href="/account?tab=bookmark">북마크</Link>
          </li>
          <li
            className={`px-1 transition-all
          ${tab === "orders" && "bg-zinc-800 font-bold text-zinc-50"}`}
          >
            <Link href="/account?tab=orders">주문 내역</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HeaderAccountPage;

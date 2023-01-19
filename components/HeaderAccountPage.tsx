import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import useLogOut from "../hooks/useLogOut";
import Button from "./Button";

interface Props {
  tab: string;
}

const HeaderAccountPage: React.FC<Props> = ({ tab }) => {
  const onLogOutSuccess = () => {
    replace("/login");
  };

  const { replace } = useRouter();
  const { mutate: logOut } = useLogOut(onLogOutSuccess);

  const onLogOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.confirm("로그아웃하시겠습니까?") && logOut();
  };

  return (
    <div className="relative mb-12 border-b text-zinc-800">
      <section className="relative px-12 py-5 flex justify-between font-bold xs:px-5">
        <header className="text-3xl font-bold">
          <hgroup>
            <h1 className="text-lg text-zinc-500">계정</h1>
            <h2 className="flex items-center gap-3 ">내 정보</h2>
          </hgroup>
        </header>
        <div className="mt-7">
          <Button
            theme="black"
            onClick={onLogOut}
            tailwindStyles="!py-1 !px-2 text-sm"
          >
            로그아웃
          </Button>
        </div>
      </section>

      <nav className="px-12 pb-5 text-lg xs:px-5">
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
            <Link href="/account?tab=bookmark">찜목록</Link>
          </li>
          <li
            className={`px-1 transition-all
          ${tab === "order" && "font-bold bg-zinc-800 text-zinc-50"}`}
          >
            <Link href="/account?tab=order">주문내역</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HeaderAccountPage;

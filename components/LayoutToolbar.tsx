import React, { MouseEvent, useEffect, useState } from "react";
import Button from "./Button";
import _ from "lodash";
import Alert from "./Alert";
import useAlert from "../hooks/useAlert";
import { useRouter } from "next/router";
import useIsAdmin from "../hooks/useIsAdmin";
import useGetUserData from "../hooks/useGetUserData";
import adminIcon from "../public/icons/admin.svg";
import Image from "next/image";
import Chat from "./Chat";
import useGetChatting from "../hooks/useGetChatting";
import useGetLatestMessages from "../hooks/useGetLatestMessages";

const LayoutToolbar = () => {
  const { data: userData } = useGetUserData();
  const isAdmin = useIsAdmin(userData);
  const { data: chattingData } = useGetChatting(
    userData?.user?.uid || "",
    userData?.user?.uid || ""
  );
  const { data: latestChattingData } = useGetLatestMessages(isAdmin);
  const { asPath } = useRouter();
  const [showToTop, setShowToTop] = useState<boolean>(false);
  const { triggerAlert, showAlert } = useAlert();
  const [showChat, setShowChat] = useState<boolean>(false);

  const toTop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const share = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const url = process.env.NEXT_PUBLIC_ABSOLUTE_URL + asPath;

    if (typeof window === "undefined") return;

    if (window.navigator.share) {
      await window.navigator.share({ text: url }).catch((error) => {
        console.error(error);
      });
    } else {
      window.navigator.clipboard.writeText(url).then(() => {
        triggerAlert();
      });
    }
  };

  // 스크롤 위치
  useEffect(() => {
    if (typeof window === "undefined") return;

    const windowScrollHandler = _.throttle(() => {
      const { scrollY, innerHeight } = window;
      setShowToTop(scrollY >= innerHeight);
    }, 300);

    window.addEventListener("scroll", windowScrollHandler);

    return () => {
      window.removeEventListener("scroll", windowScrollHandler);
    };
  }, []);

  const onToggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-50 flex flex-col gap-2">
      <Button
        onClick={toTop}
        tailwindStyles={`aspect-square pointer-events-none w-12 scale-0 px-0 py-0 rounded-full transtition origin-center ${
          showToTop && "scale-100 pointer-events-auto"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
          className="my-auto w-[20px] stroke-zinc-500 transition-transform duration-500 group-hover:translate-x-[5px]"
          style={{
            rotate: "-90deg",
            fill: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "50px",
            margin: "auto",
          }}
        >
          <polyline points="78.79 267.02 222.75 150 78.79 32.98" />
        </svg>
      </Button>
      {userData && (
        <Button
          onClick={onToggleChat}
          tailwindStyles="relative aspect-square w-12 px-0 py-0 rounded-full pointer-events-auto flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-[30px] fill-zinc-500 stroke-zinc-500 transition-transform duration-500 group-hover:translate-x-[5px]"
            style={{
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "30px",
              margin: "auto",
            }}
          >
            <path
              d="M488.8,420.3l-62-91.9c13.5-22.1,21.1-47,21.1-73.4c0-90.3-89.1-163.4-199-163.4S50,164.8,50,255.1
	s89.1,163.4,199,163.4c38.9,0,75.1-9.2,105.7-25L488.8,420.3z"
            />
          </svg>
          <span className="absolute right-0 bottom-[70%] flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-red-700 text-xs text-white">
            {isAdmin
              ? latestChattingData?.filter(
                  (chat) => !chat.isDone && chat.chatId === chat.senderId
                ).length
              : chattingData.unread >= 10
              ? "9+"
              : chattingData.unread}
          </span>
        </Button>
      )}
      <Button
        onClick={share}
        tailwindStyles="aspect-square w-12 px-0 py-0 rounded-full pointer-events-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-[30px] fill-zinc-500 stroke-zinc-500 transition-transform duration-500 group-hover:translate-x-[5px]"
          style={{
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "30px",
            margin: "auto",
            transform: "translateX(2px)",
          }}
        >
          <g>
            <circle cx="112.5" cy="112.5" r="62.5" />
            <circle cx="112.5" cy="399.5" r="62.5" />
            <circle cx="399.5" cy="256" r="62.5" />
            <line x1="112.5" y1="112.5" x2="399.5" y2="256" />
            <line x1="112.5" y1="399.5" x2="399.5" y2="256" />
          </g>
        </svg>
      </Button>
      {isAdmin && (
        <Button
          href="/admin"
          tailwindStyles="aspect-square w-12 px-0 py-0 rounded-full pointer-events-auto"
        >
          <Image src={adminIcon} alt="Admin" />
        </Button>
      )}
      <Alert show={showAlert} text="링크가 복사되었습니다." />
      {showChat && userData?.user?.uid && (
        <section className="fixed top-0 left-0 mt-12 h-screen w-screen backdrop-blur-none">
          <div className="absolute bottom-24 right-24">
            <Chat />
          </div>
        </section>
      )}
    </div>
  );
};

export default LayoutToolbar;

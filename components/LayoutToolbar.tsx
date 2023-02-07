import React, { MouseEvent, useEffect, useState } from "react";
import Button from "./Button";
import _ from "lodash";
import Modal from "./Modal";
import useModal from "../hooks/useModal";
import { useRouter } from "next/router";

const LayoutToolbar = () => {
  const { asPath } = useRouter();
  const [showToTop, setShowToTop] = useState<boolean>(false);
  const { triggerModal, showModal } = useModal();

  // 스크롤 위치
  useEffect(() => {
    if (typeof window === "undefined") return;

    const windowScrollListener = _.throttle(() => {
      const { scrollY, innerHeight } = window;
      setShowToTop(scrollY >= innerHeight);
    }, 300);

    window.addEventListener("scroll", windowScrollListener);

    return () => {
      window.removeEventListener("scroll", windowScrollListener);
    };
  }, []);

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
        triggerModal();
      });
    }
  };

  return (
    <div className="fixed right-5 bottom-5 flex flex-col gap-2">
      <Button
        onClick={toTop}
        tailwindStyles={`aspect-square pointer-events-none w-12 scale-0 px-0 py-0 rounded-full transtition origin-center ${
          showToTop && "scale-100 pointer-events-none"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
          className="stroke-zinc-500 w-[20px] my-auto transition-transform duration-500 group-hover:translate-x-[5px]"
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
      <Button
        onClick={share}
        tailwindStyles="aspect-square w-12 px-0 py-0 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="stroke-zinc-500 fill-zinc-500 w-[30px] my-auto transition-transform duration-500 group-hover:translate-x-[5px]"
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
      <Modal show={showModal} text="링크가 복사되었습니다." />
    </div>
  );
};

export default LayoutToolbar;

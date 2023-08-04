import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useGetChatting from "../hooks/useGetChatting";
import useGetLatestMessages from "../hooks/useGetLatestMessages";
import useGetUserData from "../hooks/useGetUserData";
import useIsAdmin from "../hooks/useIsAdmin";
import useSetChatting from "../hooks/useSetChatting";
import { ChattingData } from "../types";
import Button from "./Button";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import FormChat from "./FormChat";

const Chat = () => {
  const { query, push } = useRouter(),
    { data: userData } = useGetUserData(),
    [chatId, setChatId] = useState<string>(""),
    isAdmin = useIsAdmin(userData),
    { data: chattingData, fetchNextPage } = useGetChatting(
      chatId,
      userData?.user?.uid || ""
    ),
    {
      done: { mutateAsync: csDone },
    } = useSetChatting(chatId, userData?.user?.uid || ""),
    { data: chatListData } = useGetLatestMessages(isAdmin),
    chattingScrollContainerRef = useRef<HTMLDivElement>(null),
    observeTargetRef = useRef<HTMLButtonElement>(null),
    [scrollMode, setScrollMode] = useState<
      "prevChat" | "myNewChat" | "otherNewChat" | "init"
    >("init"),
    [chatting, setChatting] = useState<ChattingData>([]),
    [showMessageAlert, setShowMessageAlert] = useState<boolean>(false),
    [prevClientHeight, setPrevClientHeight] = useState<number>(0),
    [prevScrollTop, setPrevScrollTop] = useState<number>(0),
    [loadingPrevChat, setLoadingPrevChat] = useState<boolean>(false),
    [startInfinityScroll, setStartInfinityScroll] = useState<boolean>(false),
    hasPrevChat = useMemo(() => {
      return !chatting || chattingData.messageCount === undefined
        ? false
        : chatting.length < chattingData.messageCount;
    }, [chatting, chattingData.messageCount]);

  useEffect(() => {
    if (isAdmin) {
      setChatId(query.chatId as string);
    } else if (userData?.user?.uid) {
      setChatId(userData.user.uid);
    }
  }, [userData?.user?.uid, isAdmin, query]);

  // 채팅 데이터에 업데이트가 감지되면 사전에 필요한 작업을 완료 후 채팅 데이터를 상태에 저장한다.
  useEffect(() => {
    const chattingScrollContainer = chattingScrollContainerRef.current;
    if (!chattingScrollContainer) return;

    const messageWrapper =
      chattingScrollContainer.children[
        chattingScrollContainer.children.length - 1
      ];

    if (!messageWrapper) return;

    setPrevClientHeight(messageWrapper.clientHeight);
    setPrevScrollTop(chattingScrollContainer.scrollTop);
    setChatting((prev) => {
      const isPrevChat = prev[0] === chattingData.chatting[0];
      const isMyNewChat =
        chattingData.chatting[0]?.senderId === userData?.user?.uid ||
        chattingScrollContainer.scrollTop +
          chattingScrollContainer.clientHeight +
          10 >=
          chattingScrollContainer.scrollHeight;

      if (isPrevChat) {
        setScrollMode("prevChat");
      } else if (isMyNewChat) {
        setScrollMode("myNewChat");
      } else {
        setScrollMode("otherNewChat");
        setShowMessageAlert(true);
      }

      return chattingData.chatting;
    });
  }, [chattingData.chatting, userData?.user?.uid]);

  // message wrapper 리사이즈 옵저버
  // 채팅창의 스크롤을 유지하는 역할
  const handleResize = useCallback(
    (entries: any, observer: any) => {
      for (let entry of entries) {
        const targetElement = entry.target,
          chattingScrollContainer = chattingScrollContainerRef.current;

        if (!chattingScrollContainer) {
          return;
        } else if (scrollMode === "myNewChat" || scrollMode === "init") {
          chattingScrollContainer.scrollTo({
            top: chattingScrollContainer.scrollHeight,
          });
        } else if (scrollMode === "otherNewChat") {
          chattingScrollContainer.scrollTo({
            top: prevScrollTop,
          });
        } else if (scrollMode === "prevChat") {
          chattingScrollContainer.scrollTo({
            top:
              prevScrollTop + (targetElement.clientHeight - prevClientHeight),
          });
        }
      }
    },
    [prevClientHeight, prevScrollTop, scrollMode]
  );

  useEffect(() => {
    const chattingScrollContainer = chattingScrollContainerRef.current;

    if (!chattingScrollContainer) return;

    const observer = new ResizeObserver(handleResize);

    const targetElement =
      chattingScrollContainer.children[
        chattingScrollContainer.children.length - 1
      ];

    if (!targetElement) return;

    chattingScrollContainer.scrollTo({
      top: chattingScrollContainer.scrollHeight,
    });

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [handleResize, chatting]);

  // 이전 메세지 불러오기
  const onLoadPrevChat = useCallback(() => {
    setLoadingPrevChat(true);

    fetchNextPage().finally(() => {
      setLoadingPrevChat(false);
    });
  }, [fetchNextPage]);

  // 인피니티 스크롤 옵저버 생성
  useEffect(() => {
    if (!observeTargetRef.current) return;

    const scrollTrigger = new IntersectionObserver(
      (entries) => {
        entries[0].isIntersecting && onLoadPrevChat();
      },
      { threshold: 1 }
    );

    scrollTrigger.observe(observeTargetRef.current);

    return () => {
      scrollTrigger.disconnect();
    };
  }, [loadingPrevChat, onLoadPrevChat]);

  const onInfinityScrollStartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onLoadPrevChat();
    setStartInfinityScroll(true);
  };

  // 채팅창 스크롤 다운
  const onScrollBottomClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToBottom();
    setShowMessageAlert(false);
  };

  const scrollToBottom = () => {
    const chattingScrollContainer = chattingScrollContainerRef.current;
    if (!chattingScrollContainer) return;

    chattingScrollContainer.scrollTo({
      top: chattingScrollContainer.scrollHeight,
    });
  };

  const onCsResolved = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    window.confirm("해당 문의를 완료로 표시 하시겠습니까?") &&
      csDone({ chatId }).then(() => {
        push({ query: { ...query, chatId: "" } });
      });
  };

  return (
    <section className="pointer-events-auto relative m-auto flex h-[60vh] max-h-[800px] min-h-[200px] w-[50vw] min-w-[300px] max-w-[500px] grow flex-col overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100">
      <header className="bg-zinc-800 px-2 text-lg font-bold text-zinc-50">
        {isAdmin && (
          <div className="flex justify-between text-xs">
            {chatId && (
              <React.Fragment>
                <Link
                  href={{ query: { ...query, chatId: "" } }}
                  className="flex items-center pt-2"
                >
                  {"<"} 뒤로 가기
                </Link>
                <button
                  onClick={onCsResolved}
                  className="flex items-center pt-2"
                >
                  문의 마감
                </button>
              </React.Fragment>
            )}
          </div>
        )}
        <h2 className="py-1 pl-2">
          {isAdmin && chatId ? chatId : "고객 지원"}
        </h2>
      </header>
      {isAdmin && !chatId ? (
        chatListData && <ChatList chatListData={chatListData} />
      ) : (
        <React.Fragment>
          <div
            ref={chattingScrollContainerRef}
            style={{ overscrollBehavior: "none" }}
            className="flex grow flex-col overflow-scroll bg-zinc-100"
          >
            {hasPrevChat && (
              <button
                ref={startInfinityScroll ? observeTargetRef : null}
                onClick={onInfinityScrollStartClick}
                className={`pt-4 text-zinc-500 underline ${
                  startInfinityScroll && "pointer-events-none opacity-0"
                }`}
              >
                이전 대화 불러오기
              </button>
            )}
            <ChatMessages
              chattingData={chatting}
              hasPrevChat={hasPrevChat}
              chatId={chatId}
            />
          </div>
          {showMessageAlert && (
            <Button
              onClick={onScrollBottomClick}
              tailwindStyles={`group absolute flex justify-center left-0 right-0 bottom-12 m-auto aspect-square w-10 px-0 py-0 rounded-full transtition origin-center`}
            >
              <p className="absolute bottom-full m-auto w-24 rounded-lg bg-zinc-100 text-zinc-800 opacity-70 transition-all duration-500 group-hover:text-zinc-400">
                새로운 메세지
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 300"
                className="my-auto w-[15px] stroke-zinc-500 transition-transform duration-500 group-hover:translate-x-[5px]"
                style={{
                  rotate: "90deg",
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
          )}
          <FormChat chatId={chatId} />
        </React.Fragment>
      )}
    </section>
  );
};

export default Chat;

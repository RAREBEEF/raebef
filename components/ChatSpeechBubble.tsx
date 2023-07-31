import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import useGetUserData from "../hooks/useGetUserData";
import useSetChatting from "../hooks/useSetChatting";

interface Props {
  children: ReactNode;
  senderId: string;
  isMine: boolean;
  read: boolean;
  sendAt: number;
  chatId: string;
}

const ChatSpeechBubble: React.FC<Props> = ({
  children,
  senderId,
  read,
  isMine,
  sendAt,
  chatId,
}) => {
  const { data: userData } = useGetUserData(),
    {
      read: { mutateAsync: readMessage, isLoading },
    } = useSetChatting(chatId, userData?.user?.uid || ""),
    [datetime, setDatetime] = useState<string>(),
    bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const date = new Date(sendAt);
    setDatetime(
      `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  }, [sendAt]);

  // 읽음 감지 옵저버 생성
  useEffect(() => {
    const bubble = bubbleRef.current;
    if (isMine || !bubble || read || !userData?.user?.uid) return;

    const scrollTrigger = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && userData?.user?.uid && !isLoading) {
          await readMessage({ chatId, messageId: sendAt }).then(() => {
            scrollTrigger.disconnect();
          });
        }
      },
      { threshold: 0.5 }
    );

    scrollTrigger.observe(bubble);

    return () => {
      scrollTrigger.disconnect();
    };
  }, [
    bubbleRef,
    chatId,
    isLoading,
    isMine,
    read,
    readMessage,
    sendAt,
    userData,
  ]);

  return (
    <div
      ref={bubbleRef}
      className={`flex w-fit max-w-[70%] pb-1 ${isMine ? "self-end" : "ml-1"}`}
    >
      <p
        className={`text-md order-2 rounded-md px-3 py-2 text-start font-medium text-zinc-800 ${
          isMine ? "bg-zinc-300 text-zinc-800" : "bg-zinc-800 text-zinc-50"
        }`}
      >
        {children}
      </p>
      <div
        className={`${
          isMine ? "order-1" : "order-3"
        } self-end px-1 text-end text-xs text-zinc-500`}
      >
        {isMine && <p className="text-zinc-400">{read ? "읽음" : ""}</p>}
        <p>{datetime}</p>
      </div>
    </div>
  );
};

export default ChatSpeechBubble;

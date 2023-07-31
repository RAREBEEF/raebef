import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DateTimeFormatter from "../tools/dateTimeFormatter";
import { latestChatData } from "../types";

interface Props {
  chat: latestChatData;
}

const ChatLatestChatThumbnail: React.FC<Props> = ({ chat }) => {
  const dateTime = new DateTimeFormatter(chat.sendAt),
    { query } = useRouter(),
    [status, setStatus] = useState<"done" | "ongoing" | "reply">();

  useEffect(() => {
    if (chat.isDone) {
      setStatus("done");
    } else if (chat.chatId === chat.senderId) {
      setStatus("reply");
    } else {
      setStatus("ongoing");
    }
  }, [chat.chatId, chat.isDone, chat.senderId]);

  return (
    <li>
      <Link
        href={{ query: { ...query, chatId: chat.chatId } }}
        className={`grid h-full h-[72px] w-full grid-cols-2 border-b border-zinc-300 px-3 ${
          status === "done" && "bg-zinc-300"
        }`}
      >
        <div className="flex gap-2 text-base font-medium text-zinc-800">
          <div className="flex items-center justify-start">
            {chat.senderName}
          </div>
          <div
            className={`flex items-center justify-start text-xs font-bold ${
              status === "done"
                ? "text-zinc-600"
                : status === "reply"
                ? "text-red-800"
                : "text-green-800"
            }`}
          >
            {status === "done"
              ? "완료"
              : status === "reply"
              ? "답변 필요"
              : "답장 대기"}
          </div>
        </div>
        <div className="flex items-center justify-end text-xs text-zinc-600">
          {dateTime.formatting("/HOUR24/:/MINUTES/")}
        </div>
        <p className="col-span-2 pl-2 text-sm text-zinc-700 line-clamp-2">
          {chat.content}
        </p>
      </Link>
    </li>
  );
};

export default ChatLatestChatThumbnail;

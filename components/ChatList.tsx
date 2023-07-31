import { useCallback, useEffect, useState } from "react";
import DateTimeFormatter from "../tools/dateTimeFormatter";
import { latestChatData } from "../types";
import LatestChatThumbnail from "./ChatLatestChatThumbnail";

const asfasdfas = [
  {
    senderId: "1",
    senderName: "홍길동",
    sendAt: 1690417224152,
    content: "안녕",
    read: true,
    chatId: "A",
  },
  {
    senderId: "B",
    sendAt: 1680417224152,
    senderName: "홍길동",
    content: "여보세요",
    read: true,
    chatId: "BB",
  },
  {
    senderId: "C",
    sendAt: 1670417224152,
    senderName: "홍길동",
    content:
      "시발롬아 뭐라했노asjfalksdfjasklfjasklfjal마니ㅓㄹ미ㅏㄴㅇ러미ㅏㅇ럼asfjalskfjㅁ니라ㅓㅁㄴ아ㅣ럼니ㅏ럼ㄴ이ㅏ럼ㄴㅇ람넒나ㅣ럼ㄷ론ㅁ래ㅗㅁ내ㅑㅁ넒ㄴ",
    read: true,
    chatId: "C",
  },
  {
    senderId: "D",
    sendAt: 1660417224152,
    senderName: "홍길동",
    content: "넵 감사합니다",
    read: true,
    chatId: "D",
    isDone: true,
  },
  {
    senderId: "F",
    sendAt: 1650417624152,
    senderName: "홍길동",
    content: "어쩔방구",
    read: true,
    chatId: "F",
  },
  {
    senderId: "E",
    sendAt: 1650417224152,
    senderName: "홍길동",
    content: "ㅋㅋㅋㅋㅋㅋ",
    read: true,
    chatId: "E",
  },
  {
    senderId: "F",
    sendAt: 1650417228152,
    senderName: "홍길동",
    content: "누구세ㅛㅇ?",
    read: true,
    chatId: "F",
  },
  {
    senderId: "G",
    sendAt: 1650417223152,
    senderName: "홍길동",
    content: "죄송요",
    read: true,
    chatId: "G",
  },
  {
    senderId: "H",
    sendAt: 1650417225152,
    senderName: "홍길동",
    content: "빠염",
    read: true,
    chatId: "H",
  },
];

interface Props {
  chatListData: Array<latestChatData>;
}

const ChatList: React.FC<Props> = ({ chatListData }) => {
  const [chatByDate, setChatByDate] = useState<{
      [key: string]: Array<latestChatData>;
    }>({}),
    [sortedKeys, setSortedKeys] = useState<Array<string>>([]);

  const dateSort = useCallback((dates: Array<string>): Array<string> => {
    if (dates.length < 2) return dates;

    const center = Math.round(dates.length / 2),
      left = dateSort(dates.slice(0, center)),
      right = dateSort(dates.slice(center)),
      merged: Array<string> = [];

    let indexL = 0,
      indexR = 0;

    while (indexL < left.length && indexR < right.length) {
      const dateL = left[indexL].match(/[0-9]{1,}/g),
        dateR = right[indexR].match(/[0-9]{1,}/g);

      if (!dateL) {
        merged.push(...left);
        break;
      } else if (!dateR) {
        merged.push(...right);
        break;
      } else if (parseInt(dateL[0]) - parseInt(dateR[0]) > 0) {
        merged.push(left[indexL]);
        indexL += 1;
      } else if (parseInt(dateL[0]) - parseInt(dateR[0]) < 0) {
        merged.push(right[indexR]);
        indexR += 1;
      } else {
        if (parseInt(dateL[1]) - parseInt(dateR[1]) > 0) {
          merged.push(left[indexL]);
          indexL += 1;
        } else if (parseInt(dateL[1]) - parseInt(dateR[1]) < 0) {
          merged.push(right[indexR]);
          indexR += 1;
        } else {
          if (parseInt(dateL[2]) - parseInt(dateR[2]) > 0) {
            merged.push(left[indexL]);
            indexL += 1;
          } else if (parseInt(dateL[2]) - parseInt(dateR[2]) < 0) {
            merged.push(right[indexR]);
            indexR += 1;
          }
        }
      }
    }

    return merged.concat(left.slice(indexL), right.slice(indexR));
  }, []);

  useEffect(() => {
    const keys = Object.keys(chatByDate);

    setSortedKeys(dateSort(keys));
  }, [chatByDate, dateSort]);

  useEffect(() => {
    const chats: { [key: string]: Array<latestChatData> } = {};

    chatListData.forEach((chat) => {
      const dateTime = new Date(chat.sendAt),
        key = new DateTimeFormatter(dateTime).formatting("/Y/년 /m/월 /d/일");

      chats[key] = [chat, ...(chats[key] || [])];
    });

    setChatByDate(chats);
  }, [chatListData]);

  return (
    <ol
      onScroll={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex flex-col overflow-scroll"
      style={{ overscrollBehavior: "none" }}
    >
      {sortedKeys.length !== 0 &&
        sortedKeys.map((key, i) => {
          const chats = chatByDate[key];
          return (
            <li key={i}>
              <h2 className="sticky top-0 bg-zinc-800 p-1 pl-2 font-medium text-zinc-50 opacity-100">
                {key}
              </h2>
              <ol>
                {chats.map((chat, i) => (
                  <LatestChatThumbnail chat={chat} key={i} />
                ))}
              </ol>
            </li>
          );
        })}
    </ol>
  );
};

export default ChatList;

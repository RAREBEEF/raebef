import { useCallback, useEffect, useState } from "react";
import DateTimeFormatter from "../tools/dateTimeFormatter";
import { latestChatData } from "../types";
import LatestChatThumbnail from "./ChatLatestChatThumbnail";

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

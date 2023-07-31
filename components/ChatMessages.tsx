import React, { useCallback, useEffect, useState } from "react";
import useGetUserData from "../hooks/useGetUserData";
import { ChatData, ChattingData } from "../types";
import ChatSpeechBubble from "./ChatSpeechBubble";
import DateTimeFormatter from "../tools/dateTimeFormatter";

interface Props {
  chattingData: ChattingData;
  chatId: string;
}

const ChatMessages: React.FC<Props> = ({ chattingData, chatId }) => {
  const { data: userData } = useGetUserData(),
    [chatByDate, setChatByDate] = useState<{
      [key: string]: ChattingData;
    }>({}),
    [chatByDateAndSender, setChatByDateAndSender] = useState<{
      [key: string]: Array<ChattingData>;
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
      } else if (parseInt(dateL[0]) - parseInt(dateR[0]) < 0) {
        merged.push(left[indexL]);
        indexL += 1;
      } else if (parseInt(dateL[0]) - parseInt(dateR[0]) > 0) {
        merged.push(right[indexR]);
        indexR += 1;
      } else {
        if (parseInt(dateL[1]) - parseInt(dateR[1]) < 0) {
          merged.push(left[indexL]);
          indexL += 1;
        } else if (parseInt(dateL[1]) - parseInt(dateR[1]) > 0) {
          merged.push(right[indexR]);
          indexR += 1;
        } else {
          if (parseInt(dateL[2]) - parseInt(dateR[2]) < 0) {
            merged.push(left[indexL]);
            indexL += 1;
          } else if (parseInt(dateL[2]) - parseInt(dateR[2]) > 0) {
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
    const chats: { [key: string]: ChattingData } = {};

    chattingData.forEach((chat) => {
      const dateTime = new Date(chat.sendAt),
        key = new DateTimeFormatter(dateTime).formatting("/Y/년 /m/월 /d/일");

      chats[key] = [chat, ...(chats[key] || [])];
    });

    setChatByDate(chats);
  }, [chattingData, userData?.user?.uid]);

  useEffect(() => {
    const result: { [key: string]: Array<ChattingData> } = {};

    sortedKeys.forEach((key) => {
      let chats = chatByDate[key],
        chatBySender: Array<ChattingData> = [],
        curSender: null | string = null;

      for (let i = 0; i < chats.length; i++) {
        const chat = chats[i];

        if (chat.senderId !== curSender) {
          chatBySender.push([chat]);
          curSender = chat.senderId;
        } else {
          chatBySender[chatBySender.length - 1] = [
            ...chatBySender[chatBySender.length - 1],
            chat,
          ];
        }
      }
      result[key] = chatBySender;
    });

    setChatByDateAndSender(result);
  }, [chatByDate, sortedKeys]);

  return (
    <div className="flex h-fit grow flex-col p-5 pb-0">
      {sortedKeys.length !== 0 &&
        sortedKeys.map((key, i) => {
          const chattingBySender = chatByDateAndSender[key];
          return (
            <div key={i} className="flex flex-col">
              <h4 className="sticky top-1 mb-5 w-full self-center rounded-full bg-zinc-500 px-3 py-1 text-zinc-50 opacity-50">
                {key}
              </h4>
              {!!chattingBySender &&
                chattingBySender.length !== 0 &&
                chattingBySender.map((chatting, i) => {
                  const { senderName, senderId } = chatting[0];
                  return (
                    <div key={i} className="flex flex-col pb-2">
                      {senderId !== userData?.user?.uid && (
                        <div className="mb-1 font-medium">{senderName}</div>
                      )}
                      {chatting.map((chat, i) => {
                        return (
                          <ChatSpeechBubble
                            key={i}
                            sendAt={chat.sendAt}
                            senderId={chat.senderId}
                            read={chat.read}
                            isMine={userData?.user?.uid === chat.senderId}
                            chatId={chatId}
                          >
                            {chat.content}
                          </ChatSpeechBubble>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};
export default React.memo(ChatMessages);

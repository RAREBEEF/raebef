import React, { useCallback, useEffect, useState } from "react";
import useGetUserData from "../hooks/useGetUserData";
import { ChattingData } from "../types";
import ChatSpeechBubble from "./ChatSpeechBubble";
import DateTimeFormatter from "../tools/dateTimeFormatter";
import useIsAdmin from "../hooks/useIsAdmin";

interface Props {
  chattingData: ChattingData;
  chatId: string;
  hasPrevChat: boolean;
}

const ChatMessages: React.FC<Props> = ({
  chattingData,
  chatId,
  hasPrevChat,
}) => {
  const { data: userData } = useGetUserData(),
    [chatByDate, setChatByDate] = useState<{
      [key: string]: ChattingData;
    }>({}),
    [chatByDateAndSender, setChatByDateAndSender] = useState<{
      [key: string]: Array<ChattingData>;
    }>({}),
    isAdmin = useIsAdmin(userData),
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
      const dateL = new DateTimeFormatter(left[indexL]).unixTimestamp(),
        dateR = new DateTimeFormatter(right[indexR]).unixTimestamp();

      if (!dateL) {
        merged.push(...left);
        break;
      } else if (!dateR) {
        merged.push(...right);
        break;
      } else if (dateL <= dateR) {
        merged.push(left[indexL]);
        indexL += 1;
      } else if (dateL > dateR) {
        merged.push(right[indexR]);
        indexR += 1;
      }
    }

    return merged.concat(left.slice(indexL), right.slice(indexR));
  }, []);

  useEffect(() => {
    const keys = Object.keys(chatByDate);

    setSortedKeys(dateSort(keys));
  }, [chatByDate, dateSort]);

  useEffect(() => {
    const chatByDate: { [key: string]: ChattingData } = {};

    chattingData.forEach((chat) => {
      const dateTime = new Date(chat.sendAt),
        key = new DateTimeFormatter(dateTime).formatting("/Y/년 /m/월 /d/일");

      chatByDate[key] = [chat, ...(chatByDate[key] || [])];
    });

    setChatByDate(chatByDate);
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
      {!hasPrevChat && (
        <div className="flex flex-col pb-2">
          {!isAdmin && <div className="mb-1 font-medium">{"관리자"}</div>}
          <ChatSpeechBubble
            sendAt={Date.now()}
            senderId={"admin"}
            read={true}
            isMine={isAdmin ? true : false}
            chatId={chatId}
            content={
              "안녕하세요, RAEBEF 채팅 문의입니다.<br />문의 사항을 남겨주시면 확인 후 도와드리도록 하겠습니다.<br />하지만 본 사이트는 실제 운영되는 사이트가 아니기 때문에 제가 언제 확인할지는 미지수입니다."
            }
          ></ChatSpeechBubble>
        </div>
      )}
      {sortedKeys.length !== 0 &&
        sortedKeys.map((key, i) => {
          const chattingBySender = chatByDateAndSender[key];
          return (
            <div key={i} className="flex flex-col">
              <h4 className="sticky top-1 mb-5 mt-2 w-full self-center rounded-full bg-zinc-500 px-3 py-1 text-center text-zinc-50 opacity-50">
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
                            content={chat.content}
                          ></ChatSpeechBubble>
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

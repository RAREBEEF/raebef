import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "react-query";
import { db } from "../fb";
import { ChatData } from "../types";

const useSetChatting = (chatId: string, uid: string) => {
  const queryClient = useQueryClient(),
    send = useMutation(sendMessage, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
        queryClient.invalidateQueries({
          queryKey: ["unreadMessage", chatId, uid],
        });
        queryClient.invalidateQueries(["messageCount", chatId]);
        queryClient.invalidateQueries({ queryKey: ["chatList", true] });
      },
      onError: (error) => console.error(error),
    }),
    done = useMutation(csDone, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["chatList", true] });
      },
      onError: (error) => console.error(error),
    }),
    read = useMutation(readMessage, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
        queryClient.invalidateQueries({
          queryKey: ["unreadMessage", chatId, uid],
        });
        queryClient.invalidateQueries({ queryKey: ["chatList", true] });
      },
      onError: (error) => console.error(error),
    });

  return { read, send, done };
};

const readMessage = async ({
  chatId,
  messageId,
}: {
  chatId: string;
  messageId: number;
}) => {
  const docRef = doc(db, "chat", chatId, "messages", messageId.toString());

  await updateDoc(docRef, { read: true });
};

const sendMessage = async ({
  chatId,
  chatData,
}: {
  chatId: string;
  chatData: ChatData;
}) => {
  const messagesDocRef = doc(
      db,
      "chat",
      chatId,
      "messages",
      chatData.sendAt.toString()
    ),
    summaryDocRef = doc(db, "chat", chatId, "summary", "latest");
  await setDoc(messagesDocRef, chatData);
  setDoc(summaryDocRef, { ...chatData, chatId });
};

const csDone = async ({ chatId }: { chatId: string }) => {
  const summaryDocRef = doc(db, "chat", chatId, "summary", "latest");

  await updateDoc(summaryDocRef, { isDone: true });
};

export default useSetChatting;

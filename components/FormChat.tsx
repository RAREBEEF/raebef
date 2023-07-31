import Button from "./Button";
import useGetUserData from "../hooks/useGetUserData";
import useInput from "../hooks/useInput";
import { ChatData } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../fb";
import { FormEvent } from "react";
import useSetChatting from "../hooks/useSetChatting";

interface Props {
  chatId: string | undefined;
}

const FormChat: React.FC<Props> = ({ chatId }) => {
  const { data: userData } = useGetUserData();
  const {
    send: { mutateAsync: sendMessage },
  } = useSetChatting(chatId || "", userData?.user?.uid || "");
  const {
    value: content,
    setValue: setContent,
    onChange: onContentChange,
  } = useInput("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !userData?.user ||
      content.length === 0 ||
      !chatId ||
      !userData.user.displayName
    )
      return;
    const now = Date.now(),
      chatData: ChatData = {
        sendAt: now,
        senderId: userData.user.uid,
        senderName: userData.user.displayName,
        content,
        read: false,
      };

    sendMessage({ chatId, chatData });
    setContent("");
  };

  return (
    <form onSubmit={onSubmit}>
      <label className="flex h-fit w-full items-stretch rounded-md bg-zinc-200">
        <input
          value={content}
          onChange={onContentChange}
          type="text"
          placeholder="메세지 입력"
          className="min-w-[150px] grow rounded-md bg-zinc-200 px-2 py-2 text-lg outline-none"
        />
        <div className="relative flex w-fit">
          <Button tailwindStyles="h-full" height="unset" theme="black">
            전송
          </Button>
        </div>
      </label>
    </form>
  );
};

export default FormChat;

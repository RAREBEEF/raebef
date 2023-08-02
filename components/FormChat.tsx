import Button from "./Button";
import useGetUserData from "../hooks/useGetUserData";
import useInput from "../hooks/useInput";
import { ChatData } from "../types";
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
      !userData.user.displayName ||
      content.length > 200
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

    setContent("");

    await sendMessage({ chatId, chatData });
  };

  return (
    <form onSubmit={onSubmit}>
      <label className="flex h-fit w-full items-stretch rounded-md bg-zinc-200">
        <input
          value={content}
          onChange={onContentChange}
          type="text"
          maxLength={200}
          minLength={1}
          placeholder="메세지 입력"
          className="min-w-[150px] grow rounded-md bg-zinc-200 py-2 pl-2 pr-1 text-lg outline-none"
        />
        <p
          className={`flex items-center px-1 text-xs text-zinc-500 ${
            content.length >= 200 && "text-red-800"
          }`}
        >
          {content.length} / 200
        </p>
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

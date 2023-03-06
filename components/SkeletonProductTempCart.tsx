import Image from "next/image";
import Button from "./Button";
import bookmarkIcon from "../public/icons/bookmark-square.svg";

const SkeletonProductTempCart = () => {
  return (
    <div className="mt-auto flex flex-col gap-3 pt-5">
      <select
        className="mx-auto h-12 w-[100%] cursor-pointer break-keep rounded-md bg-zinc-200 px-4 py-2 text-center text-lg font-semibold text-zinc-600 transition-all hover:bg-zinc-100"
        value="size"
        onChange={() => {}}
      >
        <option value="size" disabled>
          사이즈 선택
        </option>
      </select>
      <ul className="flex h-0 flex-col gap-2 overflow-hidden rounded-md border border-none border-zinc-200 p-0 py-2 px-2 text-left text-zinc-800 transition-all"></ul>
      <div className="flex gap-2">
        <Button tailwindStyles="h-12 grow mx-auto text-lg">카트에 추가</Button>
        <Button tailwindStyles="h-12 aspect-square px-1 py-1 m-auto overflow-hidden">
          <Image
            src={bookmarkIcon}
            alt="찜하기"
            className="m-auto transition-transform duration-500 active:scale-150 active:duration-100"
            width="24"
            height="24"
            priority
          />
        </Button>
      </div>
      <Button theme="black" tailwindStyles="h-12 w-[100%] mx-auto text-lg">
        구매하기
      </Button>
    </div>
  );
};

export default SkeletonProductTempCart;

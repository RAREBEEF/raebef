import Button from "./Button";

const SkeletonProductTempCart = () => {
  return (
    <div className="mt-auto pt-5 flex flex-col gap-3">
      <select
        className="cursor-pointer w-[100%] px-4 py-2 mx-auto bg-zinc-200 rounded-md text-center text-lg font-semibold text-zinc-600 break-keep transition-all hover:bg-zinc-100"
        value="size"
        onChange={() => {}}
      >
        <option value="size" disabled>
          사이즈 선택
        </option>
      </select>
      <ul className="overflow-hidden flex flex-col gap-2 text-zinc-800 text-left border border-zinc-200 rounded-md py-2 px-2 transition-all h-0 p-0 border-none"></ul>
      <Button tailwindStyles="w-[100%] mx-auto text-lg">북마크에 추가</Button>
      <Button tailwindStyles="w-[100%] mx-auto text-lg">카트에 추가</Button>
      <Button theme="black" tailwindStyles="w-[100%] mx-auto text-lg">
        구매하기
      </Button>
    </div>
  );
};

export default SkeletonProductTempCart;

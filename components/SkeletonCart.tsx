import Button from "./Button";

interface Props {
  withoutDeleteBtn?: boolean;
}

const SkeletonCart: React.FC<Props> = ({ withoutDeleteBtn = false }) => {
  return (
    <div>
      <div className="bg-zinc-200 w-16 h-6 rounded-lg mb-5" />
      <div className="flex flex-col justify-center border-t">
        <div className="relative p-5 flex items-center justify-between gap-12 border-b border-zinc-200 whitespace-nowrap xs:px-2">
          <div className="relative basis-[15%] min-w-[100px] h-full aspect-square bg-zinc-200 rounded-lg" />
          <div className="flex gap-5 items-center justify-between flex-wrap basis-[85%]">
            <div className="basis-[30%] gap-y-1 flex flex-col justify-between items-start">
              <div className="bg-zinc-200 w-32 h-6 rounded-lg" />
              <div className="bg-zinc-100 w-24 h-5 rounded-lg text-right" />
            </div>
            <div className="justify-center items-center basis-[30%] grow flex flex-col gap-y-1">
              <div className="bg-zinc-100 w-20 h-3 rounded-lg" />
              <div className="bg-zinc-100 w-20 h-3 rounded-lg" />
            </div>
            <div className="flex grow justify-end gap-5 md:w-full">
              <div className="bg-zinc-200 w-32 h-7 rounded-lg" />
              {!withoutDeleteBtn && (
                <div className="font-semibold text-zinc-400 text-xl">X</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col items-end px-5 xs:px-2">
        <div className="bg-zinc-200 w-16 h-5 rounded-lg mb-1" />
        <div className="mb-5 w-48 h-9 bg-zinc-200 rounded-lg"></div>
      </div>
    </div>
  );
};
export default SkeletonCart;

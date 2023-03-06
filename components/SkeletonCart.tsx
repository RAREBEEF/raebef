import Button from "./Button";

interface Props {
  withoutDeleteBtn?: boolean;
}

const SkeletonCart: React.FC<Props> = ({ withoutDeleteBtn = false }) => {
  return (
    <div>
      <div className="mb-5 h-6 w-16 rounded-lg bg-zinc-200" />
      <div className="flex flex-col justify-center border-t">
        <div className="relative flex items-center justify-between gap-12 whitespace-nowrap border-b border-zinc-200 p-5 xs:px-2">
          <div className="relative aspect-square h-full min-w-[100px] basis-[15%] rounded-lg bg-zinc-200" />
          <div className="flex basis-[85%] flex-wrap items-center justify-between gap-5">
            <div className="flex basis-[30%] flex-col items-start justify-between gap-y-1">
              <div className="h-6 w-32 rounded-lg bg-zinc-200" />
              <div className="h-5 w-24 rounded-lg bg-zinc-100 text-right" />
            </div>
            <div className="flex grow basis-[30%] flex-col items-center justify-center gap-y-1">
              <div className="h-3 w-20 rounded-lg bg-zinc-100" />
              <div className="h-3 w-20 rounded-lg bg-zinc-100" />
            </div>
            <div className="flex grow justify-end gap-5 md:w-full">
              <div className="h-7 w-32 rounded-lg bg-zinc-200" />
              {!withoutDeleteBtn && (
                <div className="text-xl font-semibold text-zinc-400">X</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col items-end px-5 xs:px-2">
        <div className="mb-1 h-5 w-16 rounded-lg bg-zinc-200" />
        <div className="mb-5 h-9 w-48 rounded-lg bg-zinc-200"></div>
      </div>
    </div>
  );
};
export default SkeletonCart;

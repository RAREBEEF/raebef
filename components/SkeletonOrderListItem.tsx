import SkeletonGlowing from "./SkeletonGlowing";

const SkeletonOrderListItem = () => {
  return (
    <div className="relative flex flex-col rounded-lg border border-zinc-50 bg-zinc-100 shadow-lg shadow-zinc-300">
      <div
        className={`relative flex flex-wrap items-center justify-between gap-x-12 gap-y-5 p-5 xs:px-2`}
      >
        <div className="flex flex-col gap-3 md:gap-2">
          <div className="h-3 w-48 rounded-lg bg-zinc-200" />
          <div className="h-8 w-36 rounded-lg bg-zinc-200" />
          <div className="mt-2 h-3 w-48 rounded-lg bg-zinc-200" />
        </div>
        <div className="flex flex-col items-end gap-3 md:w-full md:gap-2">
          <div className="h-3 w-12 rounded-lg bg-zinc-200" />
          <div className="h-8 w-36 rounded-lg bg-zinc-200" />
        </div>
        <div className="flex w-full flex-col gap-3">
          <div className="h-3 w-56 self-end rounded-lg bg-zinc-200" />
          <div className="h-3 w-64 self-end rounded-lg bg-zinc-200" />
        </div>
      </div>
      <SkeletonGlowing fullWidth={true} />
    </div>
  );
};

export default SkeletonOrderListItem;

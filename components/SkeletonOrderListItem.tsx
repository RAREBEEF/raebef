const SkeletonOrderListItem = () => {
  return (
    <div className="flex flex-col border rounded-lg">
      <div
        className={`relative p-5 flex items-center justify-between flex-wrap gap-x-12 gap-y-5 xs:px-2`}
      >
        <div className="flex flex-col gap-3 md:gap-2">
          <div className="h-3 w-48 bg-zinc-100 rounded-lg" />
          <div className="bg-zinc-200 w-36 h-8 rounded-lg" />
          <div className="h-3 w-48 bg-zinc-100 rounded-lg mt-2" />
        </div>
        <div className="flex flex-col gap-3 md:gap-2 items-end md:w-full">
          <div className="h-3 w-12 bg-zinc-200 rounded-lg" />
          <div className="bg-zinc-200 w-36 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonOrderListItem;

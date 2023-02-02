const SkeletonProductCard = () => {
  return (
    <li className="relative aspect-[4/5] xs:aspect-auto">
      <div
        className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 bg-zinc-100 rounded-md overflow-hidden text-center md:gap-0 xs:flex-row xs:px-2`}
      >
        <div className="relative grow w-full p-3 xs:grow-0 xs:basis-[50%] xs:aspect-[4/5]">
          <div className="h-full w-full bg-zinc-200 rounded-lg"></div>
        </div>
        <div className="w-full flex flex-col items-center xs:basis-[50%]">
          <div className="relative h-5 w-[50%] px-2 my-2 bg-zinc-200 rounded-lg md:mb-2"></div>
          <div className="relative h-3 w-[30%] px-2 bg-zinc-200 rounded-lg"></div>
        </div>
      </div>
    </li>
  );
};

export default SkeletonProductCard;

import SkeletonGlowing from "./SkeletonGlowing";

const SkeletonProductCard = () => {
  return (
    <li className="relative aspect-[4/5] xs:aspect-auto">
      <div
        className={`relative flex h-full shrink-0 flex-col items-center justify-between gap-2 overflow-hidden rounded-md bg-zinc-100 py-2 text-center md:gap-0 xs:flex-row xs:px-2`}
      >
        <div className="relative w-full grow p-3 xs:aspect-[4/5] xs:grow-0 xs:basis-[40%] 2xs:basis-[50%]">
          <div className="h-full w-full rounded-lg bg-zinc-200"></div>
        </div>
        <div className="flex w-full flex-col items-center xs:basis-[50%]">
          <div className="relative my-2 h-5 w-[50%] rounded-lg bg-zinc-200 px-2 md:mb-2"></div>
          <div className="relative h-3 w-[30%] rounded-lg bg-zinc-200 px-2"></div>
        </div>
      </div>
      <SkeletonGlowing />
    </li>
  );
};

export default SkeletonProductCard;

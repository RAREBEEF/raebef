interface Props {
  isFetching: boolean;
}
// 로딩 중일 경우 불투명
// 로딩이 끝났을 경우 투명
const SkeletonProductCard: React.FC<Props> = ({ isFetching }) => {
  return (
    <li
      className={`relative aspect-[4/5] w-[20%] lg:w-[35%] md:w-[40%] sm:w-[40%] xs:w-[40%] 2xs:w-[100%] ${
        !isFetching && "opacity-0"
      }`}
    >
      <div
        className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 bg-zinc-100 rounded-md overflow-hidden text-center md:gap-0`}
      >
        <div className="relative grow w-full p-3">
          <div className="h-full w-full bg-zinc-200 rounded-lg"></div>
        </div>
        <div className="relative h-5 w-[50%] px-2 my-2 bg-zinc-200 rounded-lg md:mb-2"></div>
        <div className="relative h-3 w-[30%] px-2 bg-zinc-200 rounded-lg"></div>
      </div>
    </li>
  );
};

export default SkeletonProductCard;

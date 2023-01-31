interface Props {
  slideItemWidth: number;
}

const SkeletonCollectionSlide: React.FC<Props> = ({ slideItemWidth }) => {
  return (
    <li className="relative">
      <div
        className={`relative h-[223.59px] p-2 shrink-0 flex flex-col justify-between items-center gap-2 bg-zinc-100 rounded-md overflow-hidden text-center`}
        style={{ width: `${slideItemWidth}px` }}
      >
        <div className="relative h-full w-full bg-zinc-200 rounded-lg" />
        <div className="relative h-10 w-[50%] px-2 my-2 bg-zinc-200 rounded-lg md:mb-2" />
        <div className="relative h-8 w-[30%] px-2 bg-zinc-200 rounded-lg" />
      </div>
    </li>
  );
};

export default SkeletonCollectionSlide;

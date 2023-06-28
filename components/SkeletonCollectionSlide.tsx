import SkeletonGlowing from "./SkeletonGlowing";

interface Props {
  slideItemWidth: number;
}

const SkeletonCollectionSlide: React.FC<Props> = ({ slideItemWidth }) => {
  return (
    <li
      className="relative aspect-[6/7] px-4 lg:aspect-[6/4] md:aspect-[5/6] xs:aspect-[5/4]"
      style={{ width: `${slideItemWidth}px` }}
    >
      <div
        className={`relative flex h-full shrink-0 flex-col items-center justify-between gap-2 overflow-hidden rounded-md bg-zinc-100 p-2 text-center`}
      >
        <div className="relative h-full w-full rounded-lg bg-zinc-200" />
        <div className="relative my-2 h-10 w-[50%] rounded-lg bg-zinc-200 px-2 md:mb-2" />
        <div className="relative h-8 w-[30%] rounded-lg bg-zinc-200 px-2" />
      </div>
      <SkeletonGlowing />
    </li>
  );
};

export default SkeletonCollectionSlide;

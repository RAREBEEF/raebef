import { ReactNode, useEffect, useMemo } from "react";

interface Props {}

const SkeletonProductList: React.FC<Props> = () => {
  return (
    <ul className="pointer-events-none w-full pt-12 px-12 flex flex-wrap justify-center gap-10 gap-x-[4%] xs:px-5">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((el) => (
        <li
          key={el}
          className="relative aspect-[4/5] w-[20%] lg:w-[35%] md:w-[40%] sm:w-[40%] xs:w-[40%] 2xs:w-[100%]"
        >
          <div
            className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 bg-zinc-100 rounded-md overflow-hidden text-center bg-white md:gap-0`}
          >
            <div className="relative grow w-full p-3">
              <div className="h-full w-full bg-zinc-200 rounded-lg"></div>
            </div>
            <div className="relative h-5 w-[50%] px-2 bg-zinc-200 rounded-lg md:mb-2"></div>
            <div className="relative h-3 w-[30%] px-2 bg-zinc-200 rounded-lg"></div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SkeletonProductList;

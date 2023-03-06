import { Dispatch, SetStateAction } from "react";
import HeaderBasic from "./HeaderBasic";
import SkeletonProduct from "./SkeletonProduct";

interface Props {
  path: string;
}

const SkeletonProductLoading: React.FC<Props> = ({ path }) => {
  return (
    <div className="fixed top-16 left-0 z-40 h-screen w-screen overflow-y-scroll bg-white">
      <HeaderBasic title={{ text: "제품 상세" }} back={{ href: path }} />
      <SkeletonProduct />
    </div>
  );
};

export default SkeletonProductLoading;

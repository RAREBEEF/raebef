/**
 * 스켈레톤 로더의 반짝이는 효과, 스켈레톤 컴포넌트의 가장 마지막 요소로 삽입한다.
 * */

interface Props {
  fullWidth?: boolean;
}

const SkeletonGlowing: React.FC<Props> = ({ fullWidth = false }) => {
  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
      <div
        className={`absolute left-0 top-0 bottom-0 m-auto h-[150%] w-[20%] max-w-[50px] rotate-[25deg] animate-[skeleton_1.2s_ease-in-out_infinite] bg-[white] opacity-50 ${
          fullWidth &&
          `animate-[skeleton_2s_ease-in-out_infinite] xl:animate-[skeleton_3s_ease-in-out_infinite]`
        }`}
      />
    </div>
  );
};

export default SkeletonGlowing;

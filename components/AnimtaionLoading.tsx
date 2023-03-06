import loadingAnimation from "../public/json/loadingAnimation.json";
import Lottie from "lottie-web";
import { useEffect, useRef } from "react";

interface Props {
  show?: boolean;
  fullScreen?: boolean;
}

const Loading: React.FC<Props> = ({ show = true, fullScreen = false }) => {
  const animator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animator.current) return;

    const animation = Lottie.loadAnimation({
      container: animator.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <div
      className={`${
        fullScreen
          ? "fixed top-0 left-0 z-50 h-screen w-screen"
          : "h-full w-full"
      } flex items-center justify-center transition-all ${
        show
          ? `${fullScreen && "backdrop-blur-sm"} pointer-events-auto`
          : "pointer-events-none duration-500"
      }`}
    >
      <div
        ref={animator}
        className={`w-[30%] min-w-[150px] max-w-[300px] transition-opacity ${
          show ? "opacity-100" : "opacity-0 duration-500"
        }`}
      />
    </div>
  );
};

export default Loading;

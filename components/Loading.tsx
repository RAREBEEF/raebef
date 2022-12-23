import loadingAnimation from "../public/json/loadingAnimation.json";
import Lottie from "lottie-web";
import { useEffect, useRef } from "react";

interface Props {
  show: boolean;
}

const Loading: React.FC<Props> = ({ show }) => {
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
      className={`fixed top-0 z-50 h-screen w-screen flex justify-center items-center transition-all ${
        show
          ? "backdrop-blur-sm pointer-events-auto"
          : "pointer-events-none duration-500"
      }`}
    >
      <div
        ref={animator}
        className={`w-[30%] min-w-[150px] transition-opacity ${
          show ? "opacity-100" : "opacity-0 duration-500"
        }`}
      />
    </div>
  );
};

export default Loading;

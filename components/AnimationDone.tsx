import doneAnimation from "../public/json/done-dark.json";
import Lottie from "lottie-web";
import { useEffect, useRef } from "react";

interface Props {
  show: boolean;
}

const Done: React.FC<Props> = ({ show }) => {
  const animator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animator.current) return;

    const animation = Lottie.loadAnimation({
      container: animator.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: doneAnimation,
    });

    show && animation.play();

    return () => {
      animation.destroy();
    };
  }, [show]);

  return (
    <div className="w-full flex justify-center items-center transition-all">
      <div ref={animator} className="w-full max-w-[300px]" />
    </div>
  );
};

export default Done;

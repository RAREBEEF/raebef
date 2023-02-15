import Lottie from "lottie-web";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useIsFetching } from "react-query";
import loadingAnimation from "../public/json/loadingAnimation.json";

const PointerLoading = () => {
  // const isFetching = useIsFetching();
  const animator = useRef<HTMLDivElement>(null);
  const { events } = useRouter();
  const [isChangingRoute, setIsChangingRoute] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const onRouteChange = () => {
      setIsChangingRoute(true);
    };
    const onRouterChangeComplete = () => {
      setIsChangingRoute(false);
    };

    events.on("routeChangeStart", onRouteChange);
    events.on("routeChangeComplete", onRouterChangeComplete);

    return () => {
      events.off("routeChangeStart", onRouteChange);
      events.off("routeChangeComplete", onRouterChangeComplete);
    };
  }, [events]);

  // useEffect(() => {
  //   if (isFetching) {
  //     setIsLoading(true);
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [isFetching]);

  useEffect(() => {
    const windowMouseMoveListener = (e: MouseEvent) => {
      console.log(e);
      setMousePos([e.clientX, e.clientY]);
    };

    if (isChangingRoute) {
      window.addEventListener("mousemove", windowMouseMoveListener);
    } else {
      window.removeEventListener("mousemove", windowMouseMoveListener);
    }

    return () => {
      window.removeEventListener("mousemove", windowMouseMoveListener);
    };
  }, [isChangingRoute]);

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
      ref={animator}
      className={`fixed z-50 w-[50px] h-[50px] pointer-events-none ${
        isChangingRoute ? "opacity-100" : "opacity-0"
      }`}
      style={{
        top: `${mousePos[1] + 10}px`,
        left: `${mousePos[0] + 10}px`,
      }}
    />
  );
};

export default PointerLoading;

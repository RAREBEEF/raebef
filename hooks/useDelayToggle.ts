import { useState } from "react";
import StatusModal from "../components/Modal";

const useDelayToggle = () => {
  const [bool, setBool] = useState<boolean>(false);

  const sleep = (ms: number) => {
    return new Promise((f) => setTimeout(f, ms));
  };
  /**
   *
   * @param ms 토글 간격, 기본값 2000
   * @param init 최초 값, 기본값 true
   */
  const triggerToggle = async (ms: number = 2000, init: boolean = true) => {
    setBool(init);

    await sleep(ms).then(() => {
      console.log("delay");
    });

    setBool(!init);

    return bool;
  };

  return { triggerToggle, bool };
};

export default useDelayToggle;

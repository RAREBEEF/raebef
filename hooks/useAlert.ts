import { useState } from "react";
import useDelayToggle from "./useDelayToggle";

/**
 * alert 컴포넌트 제어.
 *
 * showAlert와 alertText를 Alert 컴포넌트에 전달하고 triggerAlert setAlertText 알림창을 제어한다.
 * */
const useAlert = () => {
  const { triggerToggle: triggerAlert, bool: showAlert } = useDelayToggle();
  const [alertText, setAlertText] = useState<string>("");

  return { triggerAlert, showAlert, setAlertText, alertText };
};

export default useAlert;

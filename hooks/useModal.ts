import { useState } from "react";
import useDelayToggle from "./useDelayToggle";

/**
 * 모달 컴포넌트 제어.  
 * 
 * showModal과 modalText를 모달 컴포넌트에 전달하고 triggerModal과 setModalText로 모달을 제어한다.
 * */
const useModal = () => {
  const { triggerToggle: triggerModal, bool: showModal } = useDelayToggle();
  const [modalText, setModalText] = useState<string>("");

  return { triggerModal, showModal, setModalText, modalText };
};

export default useModal;

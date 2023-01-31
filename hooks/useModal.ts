import { useState } from "react";
import useDelayToggle from "./useDelayToggle";

const useModal = () => {
  const { triggerToggle: triggerModal, bool: showModal } = useDelayToggle();
  const [modalText, setModalText] = useState<string>("");

  return { triggerModal, showModal, setModalText, modalText };
};

export default useModal;

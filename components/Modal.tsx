import { ReactNode } from "react";

interface Props {
  show: boolean;
  text?: string;
  children?: ReactNode;
}

const Modal: React.FC<Props> = ({ show, text, children }) => {
  return (
    <div
      className={`pointer-events-none fixed top-0 bottom-0 right-0 left-0 z-50 m-auto flex aspect-square w-[200px] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg p-5 transition-opacity duration-700 sm:w-[150px] ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute h-full w-full bg-zinc-800 opacity-90"></div>
      <div className="relative w-full">{children}</div>
      <span className="relative break-keep text-center text-xl font-bold text-white sm:text-base">
        {text}
      </span>
    </div>
  );
};

export default Modal;

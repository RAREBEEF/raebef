import { ReactNode } from "react";

interface Props {
  show: boolean;
  text?: string;
  children?: ReactNode;
}

const Modal: React.FC<Props> = ({ show, text, children }) => {
  return (
    <div
      className={`pointer-events-none fixed w-[200px] aspect-square top-0 bottom-0 right-0 left-0 m-auto p-5 flex flex-col justify-center items-center gap-2 z-50 rounded-lg overflow-hidden transition-opacity duration-700 sm:w-[150px] ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute z-10 w-full h-full bg-zinc-800 opacity-90"></div>
      <div className="relative z-20 w-full">{children}</div>
      <span className="relative z-20 text-white font-bold text-xl break-keep text-center sm:text-base">
        {text}
      </span>
    </div>
  );
};

export default Modal;

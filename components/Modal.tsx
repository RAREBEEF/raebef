interface Props {
  show: boolean;
  text: string;
}

const Modal: React.FC<Props> = ({ show, text }) => {
  return (
    <div
      className={`pointer-events-none fixed w-[200px] aspect-square top-0 bottom-0 right-0 left-0 m-auto flex justify-center items-center z-50 rounded-lg overflow-hidden transition-opacity duration-700 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute z-10 w-full h-full bg-zinc-800 opacity-90"></div>
      <span className="relative z-20 text-white font-bold text-2xl break-keep text-center">
        {text}
      </span>
    </div>
  );
};

export default Modal;

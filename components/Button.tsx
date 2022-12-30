import { MouseEventHandler, ReactNode } from "react";
interface Props {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tailwindStyles?: string;
}
const Button: React.FC<Props> = ({ children, onClick, tailwindStyles }) => {
  return (
    <button
      onClick={onClick}
      className={`w-fit h-fit px-4 py-2 bg-zinc-200 rounded-md text-center text-base font-semibold text-zinc-600 break-keep transition-all hover:bg-zinc-100 ${tailwindStyles}`}
    >
      {children}
    </button>
  );
};

export default Button;

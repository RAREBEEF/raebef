import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";
interface Props {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tailwindStyles?: string;
  theme?: string;
  href?: string;
}
const Button: React.FC<Props> = ({
  children,
  onClick,
  tailwindStyles,
  theme = "gray",
  href,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-fit h-fit px-4 py-2 rounded-md text-center text-base font-semibold break-keep transition-all ${
        theme === "gray"
          ? "bg-zinc-200 text-zinc-600 hover:bg-zinc-100"
          : theme === "black"
          ? "bg-zinc-800 text-zinc-50 hover:bg-zinc-500"
          : ""
      } ${tailwindStyles}`}
    >
      {href ? <Link href={href}> {children}</Link> : children}
    </button>
  );
};

export default Button;

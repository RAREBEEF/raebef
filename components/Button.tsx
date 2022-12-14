import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";
interface Props {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tailwindStyles?: string;
  theme?: string;
  href?: string;
  disabled?: boolean;
}
const Button: React.FC<Props> = ({
  children,
  onClick,
  tailwindStyles,
  theme = "gray",
  href,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-fit h-fit px-4 py-2 rounded-md text-center text-base font-semibold break-keep transition-all ${
        theme === "gray"
          ? "bg-zinc-200 text-zinc-600 hover:bg-zinc-100"
          : theme === "black"
          ? "bg-zinc-800 text-zinc-50 hover:bg-zinc-500"
          : ""
      } ${
        disabled
          ? "!pointer-events-none !bg-zinc-100 !text-zinc-200"
          : "!pointer-events-auto"
      } ${tailwindStyles}`}
    >
      {href ? <Link href={href}> {children}</Link> : children}
    </button>
  );
};

export default Button;

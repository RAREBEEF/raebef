import { PropsWithChildren } from "react";

const Button: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <button className="w-fit px-4 py-2 mx-auto my-4 bg-zinc-200 rounded-md text-md text-center font-semibold text-zinc-600 transition-all hover:bg-zinc-100 md:w-[90%]">
      {children}
    </button>
  );
};

export default Button;

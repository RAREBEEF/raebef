import Link from "next/link";
import { useEffect } from "react";

interface Props {
  title?: { text: string; href?: string };
  parent?: { text: string; href?: string };
}

const HeaderBasic: React.FC<Props> = ({ title, parent }) => {
  return (
    <header className="bg-white text-3xl font-bold border-b py-5 px-12 mb-12 md:text-2xl xs:text-xl xs:px-5">
      <hgroup>
        {parent && (
          <h1 className="text-lg text-zinc-500 md:text-base xs:text-sm">
            {parent.href ? (
              <Link href={parent.href}>{parent.text}</Link>
            ) : (
              <span>{parent.text}</span>
            )}
          </h1>
        )}
        {title && (
          <h2 className="flex items-center gap-3">
            {title.href ? (
              <Link href={title.href}>{title.text}</Link>
            ) : (
              <span>{title.text}</span>
            )}
          </h2>
        )}
      </hgroup>
    </header>
  );
};

export default HeaderBasic;

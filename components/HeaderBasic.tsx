import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  title?: { text: string; href?: string };
  toHome?: boolean;
}

const HeaderBasic: React.FC<Props> = ({ title, toHome }) => {
  const router = useRouter();

  return (
    <header className="bg-white text-3xl font-bold border-b py-5 px-12 mb-12 md:text-2xl xs:text-xl xs:px-5">
      <nav className="text-lg text-zinc-500 md:text-base xs:text-sm">
        {toHome ? (
          <Link href="/" className="group">
            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 300"
                className="stroke-zinc-500 w-[12px] my-auto transition-transform duration-500 group-hover:translate-x-[2px]"
                style={{
                  rotate: "180deg",
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "50px",
                }}
              >
                <polyline points="78.79 267.02 222.75 150 78.79 32.98" />
              </svg>
              홈으로
            </div>
          </Link>
        ) : (
          <button onClick={() => router.back()} className="group">
            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 300"
                className="stroke-zinc-500 w-[12px] my-auto transition-transform duration-500 group-hover:translate-x-[2px]"
                style={{
                  rotate: "180deg",
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "50px",
                }}
              >
                <polyline points="78.79 267.02 222.75 150 78.79 32.98" />
              </svg>
              뒤로가기
            </div>
          </button>
        )}
      </nav>
      {title && (
        <h1 className="flex items-center gap-3">
          {title.href ? (
            <Link href={title.href}>{title.text}</Link>
          ) : (
            <span>{title.text}</span>
          )}
        </h1>
      )}
    </header>
  );
};

export default HeaderBasic;

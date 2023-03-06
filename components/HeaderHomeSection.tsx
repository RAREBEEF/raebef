import Link from "next/link";

interface Props {
  text: string;
  hoverText?: string;
  href: string;
}

const HeaderHomeSection: React.FC<Props> = ({
  text,
  hoverText = "전체 보기",
  href,
}) => {
  return (
    <Link href={href}>
      <h3 className="group relative ml-6 inline-flex items-center py-6 text-3xl font-semibold text-zinc-800 md:text-2xl">
        <span className="mr-2">{text}</span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-base font-semibold text-zinc-500 opacity-0 transition-all duration-700 group-hover:max-w-full group-hover:opacity-100 xs:hidden">
          {hoverText}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
          className="my-auto w-[20px] stroke-zinc-300 transition-all duration-500 group-hover:translate-x-[5px] group-hover:stroke-zinc-500"
          style={{
            fill: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "50px",
          }}
        >
          <polyline points="78.79 267.02 222.75 150 78.79 32.98" />
        </svg>
      </h3>
    </Link>
  );
};

export default HeaderHomeSection;

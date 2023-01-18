import Link from "next/link";

interface Props {
  text: string;
  href: string;
}

const HeaderHomeSection: React.FC<Props> = ({ text, href }) => {
  return (
    <Link href={href}>
      <h3 className="group relative inline-flex items-center gap-1 ml-6 py-6 font-semibold text-3xl text-zinc-800 md:text-2xl">
        <span>{text}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
          className="stroke-zinc-800 w-[20px] my-auto transition-transform duration-500 group-hover:translate-x-[5px]"
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

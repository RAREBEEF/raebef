import Link from "next/link";

interface Props {
  title?: { text: string; href: string };
  parent?: { text: string; href: string };
}

const PageHeader: React.FC<Props> = ({ title, parent }) => {
  return (
    <header className="text-3xl font-bold border-b py-5 px-12 mb-12 xs:px-5">
      <hgroup>
        {parent && (
          <h1 className="text-lg text-zinc-500">
            <Link href={parent.href}>{parent.text}</Link>
          </h1>
        )}
        {title && (
          <h2 className="flex items-center gap-3">
            <Link href={title.href}>{title.text}</Link>
          </h2>
        )}
      </hgroup>
    </header>
  );
};

export default PageHeader;

import Image from "next/image";
import Link from "next/link";
import { CollectionType } from "../types";

interface Props {
  collection: CollectionType;
}

const CollectionSectionPhoto: React.FC<Props> = ({ collection }) => {
  return (
    <div className="group relative w-full">
      <Link href={`/collection/${collection.id}`}>
        <div className="overflow-hidden">
          <Image
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            src={collection.img.src}
            alt={collection.title}
            width={1920}
            height={1080}
            priority
          />
        </div>
        <hgroup
          className={`absolute z-1 whitespace-pre transition-all duration-500 group-hover:opacity-80 group-hover:blur ${
            collection.titlePos[0] === "top"
              ? "top-[10%] bottom-auto"
              : collection.titlePos[0] === "bottom"
              ? "top-auto bottom-[10%]"
              : "top-0 bottom-0 h-fit my-auto"
          } ${
            collection.titlePos[1] === "left"
              ? "left-[5%] right-auto text-left"
              : collection.titlePos[1] === "right"
              ? "left-auto right-[5%] text-right"
              : "left-0 right-0 text-center"
          }`}
          style={{ textShadow: "1px 1px 0px #52525b" }}
        >
          <h1 className="mb-2 text-6xl font-bold text-zinc-50 lg:text-5xl md:text-4xl sm:text-3xl">
            {collection.enTitle}
          </h1>
          <h2 className="text-4xl font-semibold text-zinc-50 lg:text-3xl md:text-2xl sm:text-lg">
            {collection.subTitle}
          </h2>
        </hgroup>
      </Link>
    </div>
  );
};

export default CollectionSectionPhoto;

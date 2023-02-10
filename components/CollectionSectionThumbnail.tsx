import Link from "next/link";
import { CollectionType } from "../types";

interface Props {
  collection: CollectionType;
}

const CollectionSectionThumbnail: React.FC<Props> = ({ collection }) => {
  return (
    <div className="group relative w-full">
      <Link href={`/collections/${collection.id}`}>
        <div className="overflow-hidden">
          <video
            poster={collection.img.src}
            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
            playsInline
            autoPlay
            loop
            muted
          >
            <source src={collection.video.src} type="video/mp4"></source>
          </video>
        </div>
        <hgroup
          className={`absolute z-1 break-keep transition-all duration-500 group-hover:opacity-80 group-hover:blur ${
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

export default CollectionSectionThumbnail;

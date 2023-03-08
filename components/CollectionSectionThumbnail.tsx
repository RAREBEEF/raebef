import Link from "next/link";
import { CollectionType } from "../types";

interface Props {
  collection: CollectionType;
}

const CollectionSectionThumbnail: React.FC<Props> = ({ collection }) => {
  return (
    <div className="group relative w-full overflow-hidden">
      <Link href={`/collections/${collection.id}`}>
        <div className="relative mx-[-1px] aspect-auto max-h-[300px] overflow-hidden xl:max-h-[450px]">
          <video
            poster={collection.img.src}
            className="h-full w-full translate-y-[-30%] transition-transform duration-500 group-hover:scale-110 lg:translate-y-0"
            playsInline
            autoPlay
            loop
            muted
          >
            <source
              src={`/videos/${collection.id}.mov`}
              type="video/mp4"
            ></source>
          </video>
        </div>
        <hgroup
          className={`z-1 absolute break-keep transition-all duration-500 group-hover:opacity-80 group-hover:blur ${
            collection.titlePos[0] === "top"
              ? "top-[10%] bottom-auto"
              : collection.titlePos[0] === "bottom"
              ? "top-auto bottom-[10%]"
              : "top-0 bottom-0 my-auto h-fit"
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

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CollectionType } from "../types";
import CollectionSectionSlide from "./CollectionSectionSlide";
import HomeSectionHeader from "./HomeSectionHeader";

interface Props {
  collection: CollectionType;
}

const CollectionSection: React.FC<Props> = ({ collection: data }) => {
  return (
    <section className="relative">
      <div className="group relative w-full">
        <Link href={`/collection/${data.id}`}>
          <div className="overflow-hidden">
            <Image
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              src={data.img.src}
              alt={data.title}
              width={1920}
              height={1080}
              priority
            />
          </div>
          <hgroup
            className={`absolute z-1 whitespace-pre transition-all duration-500 group-hover:opacity-80 group-hover:blur ${
              data.titlePos[0] === "top"
                ? "top-[10%] bottom-auto"
                : data.titlePos[0] === "bottom"
                ? "top-auto bottom-[10%]"
                : "top-0 bottom-0 h-fit my-auto"
            }
          ${
            data.titlePos[1] === "left"
              ? "left-[5%] right-auto text-left"
              : data.titlePos[1] === "right"
              ? "left-auto right-[5%] text-right"
              : "left-0 right-0 text-center"
          }`}
            style={{ textShadow: "1px 1px 0px #52525b" }}
          >
            <h1 className="mb-2 text-6xl font-bold text-zinc-50 lg:text-5xl md:text-4xl">
              {data.enTitle}
            </h1>
            <h2 className="text-4xl font-semibold text-zinc-50 lg:text-3xl md:text-2xl">
              {data.subTitle}
            </h2>
          </hgroup>
        </Link>
      </div>
      <div className="my-2 overflow-hidden">
        <HomeSectionHeader text={data.title} href={`/collection/${data.id}`} />
        <CollectionSectionSlide productIdList={data.products.slice(0, 10)} />
      </div>
    </section>
  );
};

export default CollectionSection;

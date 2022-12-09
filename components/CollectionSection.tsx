import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CollectionType } from "../types";
import CollectionSectionSlide from "./CollectionSectionSlide";

interface Props {
  collection: CollectionType;
}

const CollectionSection: React.FC<Props> = ({ collection: data }) => {
  return (
    <section className="relative">
      <div className="relative w-full">
        <Link href={`/collection/${data.id}`}>
          <Image
            src={data.img.src}
            alt={data.title}
            width={1920}
            height={1080}
            priority
          />
        </Link>
        <hgroup
          className={`absolute z-1 whitespace-pre ${
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
            {data.title}
          </h1>
          <h2 className="text-4xl font-semibold text-zinc-50 lg:text-3xl md:text-2xl">
            {data.subTitle}
          </h2>
        </hgroup>
      </div>
      <div className="my-2 py-4 overflow-hidden">
        <Link href={`/collection/${data.id}`}>
          <h3 className="list-title relative h-[25px] inline-flex items-center gap-1 mb-4 ml-4 font-semibold text-3xl text-zinc-800 md:text-2xl md:h-[20px] md:mb-3">
            <span>{data.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 300"
              className="stroke-zinc-800 h-full w-[20px] my-auto pt-1 transition-transform duration-500"
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
        <CollectionSectionSlide productIdList={data.products.slice(0, 10)} />
      </div>
      <style jsx>{`
        .list-title {
          &:hover {
            svg {
              transform: translateX(5px);
            }
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionSection;

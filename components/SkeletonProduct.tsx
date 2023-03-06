import React from "react";
import SkeletonProductTempCart from "./SkeletonProductTempCart";

const SkeletonProduct = () => {
  return (
    <div className="container relative flex flex-col gap-12 px-12 xs:px-5">
      <div className="relative flex justify-evenly gap-5 sm:flex-col">
        <div className="aspect-square min-h-full max-w-[500px] grow basis-[50%] rounded-lg bg-zinc-100" />
        <div className="flex basis-[45%] flex-col gap-3 text-right text-zinc-800 sm:text-left">
          <div className="flex flex-col gap-3">
            <div className="h-9 w-48 self-end rounded-lg bg-zinc-100 sm:self-start xs:h-8" />
            <div className="h-6 w-24 self-end rounded-lg bg-zinc-100 sm:self-start" />
            <div className="h-7 w-32 self-end rounded-lg bg-zinc-100 sm:self-start" />
            <div className="h-5 w-24 self-end rounded-lg bg-zinc-100 sm:self-start" />
          </div>
          <SkeletonProductTempCart />
        </div>
      </div>
      <div className="relative flex h-fit w-full flex-col gap-3 border-t pt-12 text-zinc-800">
        <div className="h-56 w-full rounded-lg bg-zinc-100" />
        <div className="h-screen w-full rounded-lg bg-zinc-100" />
      </div>
    </div>
  );
};

export default SkeletonProduct;

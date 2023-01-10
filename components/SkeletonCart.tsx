import Button from "./Button";

const SkeletonCart = () => {
  return (
    <section className="px-12 xs:px-5">
      <div className="bg-zinc-200 w-16 h-6 rounded-lg mb-5" />
      <div className="flex flex-col justify-center">
        <div className="relative p-5 flex items-center justify-between gap-5 flex-wrap border-b border-zinc-200 whitespace-nowrap xs:px-2">
          <div className="relative basis-[10%] h-full aspect-square bg-zinc-200 rounded-lg" />
          <div className="basis-[30%] flex items-center justify-between gap-y-1 lg:grow lg:gap-x-12 lg:justify-start md:flex-col md:items-start md:justify-center">
            <div className="bg-zinc-200 w-32 h-7 rounded-lg" />
            <div className="bg-zinc-100 w-24 h-5 rounded-lg text-right" />
          </div>
          <div className="flex flex-col gap-1 items-center basis-[30%] lg:basis-0">
            <div className="bg-zinc-100 w-20 h-3 rounded-lg" />
            <div className="bg-zinc-100 w-20 h-3 rounded-lg" />
          </div>
          <div className="flex grow justify-end items-center gap-5 lg:w-full">
            <div className="bg-zinc-200 w-32 h-7 rounded-lg" />
            <div className="font-semibold text-zinc-400 text-xl">X</div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-end px-5 xs:px-2">
        <div className="bg-zinc-200 w-16 h-5 rounded-lg mb-1" />
        <div className="mb-5 w-48 h-9 bg-zinc-200 rounded-lg"></div>
        <Button theme="black" disabled={true}>
          결제하기
        </Button>
      </div>
    </section>
  );
};
export default SkeletonCart;

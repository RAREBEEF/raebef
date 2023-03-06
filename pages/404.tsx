import React from "react";
import Button from "../components/Button";
import HeaderBasic from "../components/HeaderBasic";
import Seo from "../components/Seo";

const NotFound = () => {
  return (
    <React.Fragment>
      <main className="page-container flex flex-col">
        <Seo title="NOT FOUND" />
        <HeaderBasic title={{ text: "404 NOT FOUND" }} />
        <section className="relative flex min-h-[300px] grow flex-col items-center justify-center gap-5 px-12 xs:px-5">
          <div className="flex flex-col items-center justify-center text-2xl font-bold text-zinc-800">
            존재하지 않는 페이지입니다.
          </div>
          <Button theme="black" href={"/"}>
            홈으로
          </Button>
        </section>
      </main>
    </React.Fragment>
  );
};

export default NotFound;

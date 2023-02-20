import { useEffect } from "react";
import Collections from "../components/Collections";
import QuickCategory from "../components/QuickCategory";
import Seo from "../components/Seo";
import useGetUserData from "../hooks/useGetUserData";

const Home = () => {
  return (
    <main className="page-container pb-24">
      <Seo />
      <Collections />
      <QuickCategory />
    </main>
  );
};

export default Home;

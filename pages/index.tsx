import Head from "next/head";
import Collections from "../components/Collections";
import QuickCategory from "../components/QuickCategory";
import useGetUserData from "../hooks/useGetUserData";

const Home = () => {
  const { data: userData } = useGetUserData();

  return (
    <main className="page-container">
      <Head>
        <title>RAEBEF</title>
      </Head>
      <Collections />
      <QuickCategory />
    </main>
  );
};

export default Home;

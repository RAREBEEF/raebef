import Collections from "../components/Collections";
import QuickCategory from "../components/QuickCategory";
import Seo from "../components/Seo";

const Home = () => {
  return (
    <main className="page-container bg-white">
      <Seo />
      <Collections />
      <QuickCategory />
    </main>
  );
};

export default Home;

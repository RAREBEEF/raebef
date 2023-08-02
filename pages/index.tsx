import Collections from "../components/Collections";
import QuickCategory from "../components/QuickCategory";
import Seo from "../components/Seo";

const Home = () => {
  return (
    <main className="page-container flex flex-col bg-white">
      <Seo />
      <div className="order-2">
        <Collections />
      </div>
      <div className="order-3 xs:order-1">
        <QuickCategory />
      </div>
    </main>
  );
};

export default Home;

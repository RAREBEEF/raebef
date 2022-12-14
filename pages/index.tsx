import Collections from "../components/Collections";
import QuickCategory from "../components/QuickCategory";
import useGetUserData from "../hooks/useGetUserData";

const Home = () => {
  const { data: userData } = useGetUserData();

  console.log(userData);
  return (
    <main className="page-container">
      <Collections />
      <QuickCategory />
    </main>
  );
};

export default Home;

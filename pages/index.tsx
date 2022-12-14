import CollectionSection from "../components/CollectionSection";
import { useQuery } from "react-query";
import getCollections from "./api/getCollections";
import CategoryShortcutSection from "../components/CategoryShortcutSection";

const Home = () => {
  const {
    status,
    data: collections,
    error,
  } = useQuery("collections", getCollections);

  return (
    <div className="page-container">
      {collections?.map((collection, i) => {
        return <CollectionSection collection={collection} key={i} />;
      })}
      <CategoryShortcutSection />
    </div>
  );
};

export default Home;

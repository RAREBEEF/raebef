import CollectionSection from "../components/CollectionSection";
import { useQuery } from "react-query";
import getCollections from "./api/getCollections";

const Home = () => {
  const {
    status,
    data: collections,
    error,
  } = useQuery("collections", getCollections);

  return (
    <div className="page-container">
      <section className="overflow-hidden">
        {collections?.map((collection, i) => {
          return <CollectionSection collection={collection} key={i} />;
        })}
      </section>
    </div>
  );
};

export default Home;

import Collection from "../components/Collection";
import collections from "../collectionsDummy.json";

const Home = () => {
  return (
    <div className="page-container">
      <section className="overflow-hidden">
        {collections.map((data, i) => {
          return <Collection data={data} key={i} />;
        })}
      </section>
    </div>
  );
};

export default Home;

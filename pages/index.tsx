import Collection from "../components/Collection";
import collections from "../collectionsDummy.json";

export interface CollectionDataType {
  id: string;
  title: string;
  subTitle: string;
  titlePos: Array<string>;
  img: { src: string };
  tags: Array<string>;
  items: Array<string>;
}

const Home = () => {
  return (
    <div className="page-container max-w-[1300px] min-w-[360px] mx-auto">
      <section className="overflow-hidden">
        {collections.map((data, i) => {
          return <Collection data={data} order={i + 1} key={i} />;
        })}
      </section>
    </div>
  );
};

export default Home;

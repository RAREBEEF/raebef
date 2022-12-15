import React from "react";
import { CollectionType } from "../types";
import CollectionSectionSlide from "./CollectionSectionSlide";
import CollectionSectionPhoto from "./CollectionSectionPhoto";
import HomeSectionHeader from "./HomeSectionHeader";

interface Props {
  collection: CollectionType;
}

const CollectionSection: React.FC<Props> = ({ collection }) => {
  return (
    <section className="relative">
      <CollectionSectionPhoto collection={collection} />
      <div className="my-2 overflow-hidden">
        <HomeSectionHeader
          text={collection.title}
          href={`/collection/${collection.id}`}
        />
        <CollectionSectionSlide
          productIdList={collection.products.slice(0, 10)}
        />
      </div>
    </section>
  );
};

export default CollectionSection;

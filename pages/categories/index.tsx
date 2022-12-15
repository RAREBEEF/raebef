import Link from "next/link";
import { Category } from "../../types";
import categoryData from "../../public/json/categoryData.json";
import PageHeader from "../../components/PageHeader";

const CategoryList = () => {
  const categoryNavGenerator = (category: Category, i: number) => {
    return (
      <li key={i}>
        <Link href={`/categories/${category.path}`}>
          <h3 className="text-zinc-800 text-2xl font-bold">{category.name}</h3>
        </Link>
        <ul className="flex flex-wrap gap-5 pl-5 mt-5 text-zinc-500 text-xl font-semibold">
          {category.subCategories?.map((subCategory, i) => (
            <li key={i}>
              <Link href={`/categories/${category.path}/${subCategory.path}`}>
                {subCategory.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <div className="page-container">
      <PageHeader
        title={{ text: "카테고리 목록", href: "/categories" }}
        parent={{ text: "카테고리", href: "/categories" }}
      />
      <ul className="flex flex-col px-12 gap-12 xs:px-5">
        {Object.keys(categoryData).map((key, i) =>
          // @ts-ignored
          categoryNavGenerator(categoryData[key], i)
        )}
      </ul>
    </div>
  );
};

export default CategoryList;

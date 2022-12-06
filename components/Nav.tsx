import Image from "next/image";
import Link from "next/link";
import logo from "../public/logos/logo512.svg";
import cartIcon from "../public/icons/cart-nav.svg";
import profileIcon from "../public/icons/profile-nav.svg";

interface Category {
  name: string;
  path: string;
  subCategories?: Array<Category>;
}

const Nav = () => {
  const categoryGenerator = (category: Category, i: number) => {
    return (
      <li key={i}>
        <Link href={`/categories/${category.path}`}>
          <h3 className="mb-3 xs:text-base">{category.name}</h3>
        </Link>
        <ul className="text-zinc-500 flex flex-col gap-2 text-sm">
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
    <nav>
      <ol className="z-50 w-full min-w-[360px] max-w-[1300px] mx-auto h-16 fixed top-0 left-0 right-0 flex justify-evenly items-center gap-5 p-4 px-10 bg-white border-b font-semibold text-lg text-zinc-800 xs:text-sm">
        <div className="flex grow items-center justify-start gap-10 sm:gap-5">
          <li className="shrink-0 w-24 mx-4 xs:w-16 xs:mx-2">
            <Link href="/">
              <Image src={logo} alt="로고" />
            </Link>
          </li>
          <li>
            <Link
              href="/collection"
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 xs:px-2"
            >
              컬렉션
            </Link>
          </li>
          <li className="group">
            <Link
              href="/categories"
              className="px-4 py-2 flex justify-center items-center rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 xs:px-2"
            >
              카테고리
            </Link>
            <div className="w-full h-0 absolute left-0 top-full bg-white border-zinc-200 overflow-hidden transition-all duration-500 group-hover:h-[220px] group-hover:border-y">
              <ul className="w-full flex justify-evenly mt-4 text-lg">
                {categoryData.map((category, i) =>
                  categoryGenerator(category, i)
                )}
              </ul>
            </div>
          </li>
        </div>
        <div className="flex gap-2">
          <li>
            <Link
              href="/profile"
              className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 "
            >
              <div className="w-6 md:w-6 2xs:w-5">
                <Image src={profileIcon} alt="Profile" />
              </div>
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="px-1 py-1 flex justify-center items-center gap-1 rounded-md whitespace-nowrap transition-all hover:bg-zinc-200 "
            >
              <div className="w-6 md:w-6 2xs:w-5">
                <Image src={cartIcon} alt="Shopping cart" />
              </div>
              <span className="w-5 h-5 flex justify-center self-start bg-[firebrick] border border-[firebrick] rounded-full text-white text-xs font-bold">
                9+
              </span>
            </Link>
          </li>
        </div>
      </ol>
    </nav>
  );
};

export default Nav;

export const categoryData = [
  {
    name: "의류",
    path: "clothes",
    subCategories: [
      { name: "아우터", path: "outer" },
      { name: "상의", path: "top" },
      { name: "바지", path: "pants" },
      { name: "치마", path: "skirt" },
    ],
  },
  {
    name: "악세서리",
    path: "accessory",
    subCategories: [
      { name: "모자", path: "hat" },
      { name: "벨트", path: "belt" },
      { name: "장갑", path: "gloves" },
      { name: "넥웨어", path: "neckwear" },
      { name: "지갑", path: "wallet" },
    ],
  },
  {
    name: "신발",
    path: "shoes",
    subCategories: [
      { name: "운동화", path: "sport" },
      { name: "구두", path: "dress" },
      { name: "하이힐", path: "highheel" },
      { name: "샌들", path: "sandal" },
      { name: "부츠", path: "boots" },
    ],
  },
  {
    name: "가방",
    path: "bag",
    subCategories: [
      { name: "핸드백", path: "handbag" },
      { name: "백팩", path: "backpack" },
      { name: "클러치", path: "clutch" },
      { name: "캐리어", path: "luggage" },
    ],
  },
  {
    name: "주얼리",
    path: "jewel",
    subCategories: [
      { name: "귀걸이", path: "earring" },
      { name: "목걸이", path: "necklace" },
      { name: "반지", path: "ring" },
      { name: "시계 및 팔찌", path: "bracelet" },
    ],
  },
];

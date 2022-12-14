import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import ProductTempCart from "../../components/ProductTempCart";
import SkeletonProduct from "../../components/SkeletonProduct";
import useGetProduct from "../../hooks/useGetProduct";
import useIsSoldOut from "../../hooks/useIsSoldOut";
import useLineBreaker from "../../hooks/useLineBreaker";
import categoryData from "../../public/json/categoryData.json";
import { CategoryDataType } from "../../types";

const Product = () => {
  const lineBreaker = useLineBreaker();
  const {
    query: { id },
    back,
  } = useRouter();
  const [uploadDate, setUploadDate] = useState<string>("");

  const errorHandler = () => {
    window.alert(
      "제품을 불러오는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
    );

    back();
  };

  const { data: product } = useGetProduct(id as string, errorHandler);
  const isSoldOut = useIsSoldOut(product?.stock);

  // 업로드 날짜 구하기
  useEffect(() => {
    if (!product) return;

    const date = new Date(product.date);
    const parseDate =
      date.getFullYear() +
      " / " +
      (date.getMonth() + 1) +
      " / " +
      date.getDate();

    setUploadDate(parseDate);
  }, [product]);

  return (
    <main className="page-container">
      <PageHeader
        title={{ text: product ? product.name : "제품 상세" }}
        parent={{
          text: product
            ? (categoryData as CategoryDataType)[
                product.category
              ].subCategories?.find((cur) => cur.path === product.subCategory)
                ?.name || ""
            : "카테고리",
          href: product
            ? `/categories/${product.category}/${product.subCategory}`
            : undefined,
        }}
      />

      {product ? (
        <div className="flex flex-col px-12 gap-12 xs:px-5">
          <div className="relative flex justify-evenly gap-5 sm:flex-col">
            <div className="group relative basis-[50%] grow aspect-square max-w-[500px]">
              <Image
                src={product.thumbnail.src}
                alt={product.name}
                fill
                objectFit="contain"
              />

              {isSoldOut && (
                <h5 className="pointer-events-none z-20 absolute h-fit w-fit px-4 py-2 top-0 bottom-0 left-0 right-0 m-auto rotate-[-25deg] text-center font-bold text-6xl text-[white] whitespace-nowrap bg-zinc-800 opacity-90 transition-opacity duration-500 group-hover:opacity-20 lg:text-5xl md:text-4xl sm:text-6xl xs:text-5xl">
                  SOLD OUT
                </h5>
              )}
            </div>

            <div className="basis-[45%] flex flex-col gap-3 text-right text-zinc-800 sm:text-left">
              <header className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold">{product.name}</h1>

                <h2 className="text-base font-semibold">
                  <Link href={`/categories/${product.category}/all`}>
                    {(categoryData as CategoryDataType)[product.category].name}
                  </Link>{" "}
                  <span className="text-zinc-500">&gt;</span>{" "}
                  <Link
                    href={`/categories/${product.category}/${product.subCategory}`}
                  >
                    {(categoryData as CategoryDataType)[
                      product.category
                    ].subCategories?.find(
                      (cur) => cur.path === product.subCategory
                    )?.name || ""}
                  </Link>
                </h2>

                <h2 className="text-xl font-semibold">
                  {product.price.toLocaleString("ko-KR")} ₩
                </h2>

                <h3 className="text-sm text-zinc-500">{uploadDate}</h3>
              </header>
              <ProductTempCart product={product} />
            </div>
          </div>

          <article className="relative w-full h-fit pt-12 flex flex-col gap-3 border-t text-zinc-800">
            <h2 className="text-2xl font-semibold">제품 설명</h2>
            <p className="break-keep text-lg font-medium pl-2">
              {lineBreaker(product.description)}
            </p>

            <section className="w-full mt-9 flex flex-col gap-12">
              {product.detailImgs.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={`${product.name} 상세 사진 ${i}`}
                  className="max-h-[90vh] object-contain m-auto"
                />
              ))}
            </section>
          </article>
        </div>
      ) : (
        <SkeletonProduct />
      )}
    </main>
  );
};

export default Product;

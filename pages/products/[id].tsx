import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import ProductTempCart from "../../components/ProductTempCart";
import useGetProduct from "../../hooks/useGetProduct";
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

  return product ? (
    <main className="page-container">
      <PageHeader
        title={{ text: product.name }}
        parent={{ text: "제품 정보" }}
      />

      <div className="flex flex-col pt-16 px-12 gap-12 xs:px-5">
        <div className="relative flex justify-evenly gap-5 sm:flex-col">
          <div className="relative basis-[50%] grow aspect-square max-w-[500px] self-start sm:self-auto">
            <Image
              src={product.thumbnail.src}
              alt={product.name}
              fill
              objectFit="contain"
            />
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
            <img
              src={product.detailImgs[0].src}
              alt={product.name}
              className="max-h-[90vh] object-contain m-auto"
            />
            <img
              src={product.detailImgs[0].src}
              alt={product.name}
              className="max-h-[90vh] object-contain m-auto"
            />
          </section>
        </article>
      </div>
    </main>
  ) : (
    <></>
  );
};

export default Product;

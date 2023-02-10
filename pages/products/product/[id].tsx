import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import Loading from "../../../components/AnimtaionLoading";
import Button from "../../../components/Button";
import CartTemp from "../../../components/CartTemp";
import HeaderBasic from "../../../components/HeaderBasic";
import Seo from "../../../components/Seo";
import SkeletonProduct from "../../../components/SkeletonProduct";
import { db } from "../../../fb";
import useGetUserData from "../../../hooks/useGetUserData";
import useIsAdmin from "../../../hooks/useIsAdmin";
import useIsSoldOut from "../../../hooks/useIsSoldOut";
import useLineBreaker from "../../../hooks/useLineBreaker";
import useProduct from "../../../hooks/useProduct";
import categoryData from "../../../public/json/categoryData.json";
import { CategoryDataType, ProductType } from "../../../types";

const Product = (productData: ProductType) => {
  const lineBreaker = useLineBreaker();
  const { data: userData } = useGetUserData();
  const {
    query: { id },
    reload,
  } = useRouter();
  const [uploadDate, setUploadDate] = useState<string>("");
  const [product, setProduct] = useState<ProductType | null>(null);
  const isSoldOut = useIsSoldOut((product as ProductType) || null);
  const isAdmin = useIsAdmin(userData);
  const {
    deleteProduct: { mutateAsync: deleteProduct, isLoading: deleting },
  } = useProduct();

  // 제품 체크 및 업로드 날짜 구하기
  useEffect(() => {
    if (!productData) return;

    if (Object.keys(productData).length === 0) return;

    setProduct(productData);

    const date = new Date((productData as ProductType).date);
    const parseDate =
      date.getFullYear() +
      " / " +
      (date.getMonth() + 1) +
      " / " +
      date.getDate();

    setUploadDate(parseDate);
  }, [productData]);

  const onDeleteProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      return;
    }

    window.confirm("제품을 삭제하시겠습니까?") &&
      deleteProduct(id as string)
        .catch((error) => {
          console.error(error);
          window.alert(
            "제품 삭제 과정에서 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
          );
        })
        .then(() => {
          window.alert("제품이 삭제되었습니다.");
          reload();
        });
  };

  return (
    <main className="page-container">
      <Seo
        title={productData?.name}
        description={
          (productData?.description ? productData?.description + " " : "") +
          `지금 RAEBEF에서 ${productData?.name}을 확인해보세요.`
        }
        url={
          process.env.NEXT_PUBLIC_ABSOLUTE_URL +
          "/products/product/" +
          productData?.id
        }
        img={productData?.thumbnail.src}
      />
      <HeaderBasic
        title={{
          text:
            productData && productData.name
              ? productData.name
              : "존재하지 않는 제품입니다.",
        }}
        parent={{
          text: product
            ? (categoryData as CategoryDataType)[
                product.category
              ]?.subCategories?.find((cur) => cur.path === product.subCategory)
                ?.name || ""
            : "카테고리",
          href: product
            ? `/products/categories/${product.category}/${product.subCategory}`
            : "/products/categories/all",
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
                  <Link href={`/products/categories/${product.category}/all`}>
                    {(categoryData as CategoryDataType)[product.category].name}
                  </Link>{" "}
                  <span className="text-zinc-500">&gt;</span>{" "}
                  <Link
                    href={`/products/categories/${product.category}/${product.subCategory}`}
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
              <CartTemp product={product} />
              {isAdmin && (
                <div className="flex flex-col gap-2 border rounded-lg p-2 text-center">
                  <h4 className="basis-full font-semibold text-lg text-center">
                    관리자 메뉴
                  </h4>
                  <p className="text-sm text-zinc-500">
                    제품 ID
                    <br />
                    {product.id}
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                      tailwindStyles="text-xs px-2 py-1"
                      theme="black"
                      href={`/admin/product/edit/${id}`}
                    >
                      제품 수정
                    </Button>
                    <Button
                      onClick={onDeleteProduct}
                      tailwindStyles="text-xs px-2 py-1"
                      theme="red"
                    >
                      제품 삭제
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <article className="relative w-full h-fit pt-12 flex flex-col gap-3 border-t text-zinc-700">
            <p className="w-[50%] leading-8 mx-auto break-keep text-base font-medium pl-2 text-center lg:w-[70%] md:w-[80%] sm:w-full">
              {lineBreaker(product.description)}
            </p>

            <section className="w-full mt-9 flex flex-col gap-12">
              {product.detailImgs.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={`${product.name} 상세 사진 ${i}`}
                  className="object-contain m-auto"
                />
              ))}
            </section>
          </article>
        </div>
      ) : (
        <SkeletonProduct />
      )}
      <Loading show={deleting} fullScreen={true} />
    </main>
  );
};

export default Product;

export async function getServerSideProps({ query }: any) {
  const id = query.id;

  if (!id) return { props: {} };

  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  return { props: (docSnap.data() as ProductType) || {} };
}

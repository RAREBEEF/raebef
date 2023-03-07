import { doc, getDoc } from "firebase/firestore";
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
import useGetProductsById from "../../../hooks/useGetProductsById";
import useGetUserData from "../../../hooks/useGetUserData";
import useIsAdmin from "../../../hooks/useIsAdmin";
import useLineBreaker from "../../../hooks/useLineBreaker";
import useProduct from "../../../hooks/useProduct";
import categoryData from "../../../public/json/categoryData.json";
import { CategoryDataType, ProductType } from "../../../types";

interface serverSideProductType extends ProductType {
  isEmpty?: boolean;
  isError?: boolean;
  inApp?: boolean;
}

const Product = (productData: serverSideProductType) => {
  const lineBreaker = useLineBreaker();
  const { data: userData } = useGetUserData();
  const {
    query: { id },
    reload,
  } = useRouter();
  const [needQuery, setNeedQuery] = useState<boolean>(false);
  const [uploadDate, setUploadDate] = useState<string>("");
  const [product, setProduct] = useState<serverSideProductType | null>(null);
  const isAdmin = useIsAdmin(userData);
  const {
    deleteProduct: { mutateAsync: deleteProduct, isLoading: deleting },
  } = useProduct();
  const {
    data: queriedProductData,
    isLoading,
    isFetched,
  } = useGetProductsById((id as string) || "", needQuery);

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

  // serverSide에서 불러온 제품 데이터를 체크하고 상태에 저장 및 업로드 날짜 구하기
  useEffect(() => {
    if (
      !productData ||
      productData.inApp ||
      productData.isEmpty ||
      productData.isError ||
      Object.keys(productData).length === 0
    ) {
      setNeedQuery(true);
      return;
    }

    setProduct(productData);
  }, [productData]);

  useEffect(() => {
    if (!needQuery || !queriedProductData) return;

    setProduct(queriedProductData);
  }, [needQuery, queriedProductData]);

  // 제품 등록 날짜
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
        img={productData?.thumbnail?.src}
      />
      <HeaderBasic
        title={{
          text: product?.name
            ? product.name
            : !isFetched
            ? "제품 상세"
            : "존재하지 않는 제품입니다.",
        }}
      />

      {!product ? (
        <SkeletonProduct />
      ) : (
        <div className="flex flex-col gap-12 px-12 pb-24 xs:px-5">
          <div className="relative flex justify-evenly gap-5 sm:flex-col">
            <div className="group relative aspect-square max-w-[500px] grow basis-[50%]">
              <Image
                src={product?.thumbnail?.src || ""}
                alt={product?.name || ""}
                fill
                sizes="(max-width: 639px) 100vw,
                50vw"
                className="object-contain"
              />

              {product.totalStock <= 0 && (
                <h5 className="pointer-events-none absolute top-0 bottom-0 left-0 right-0 z-20 m-auto h-fit w-fit rotate-[-25deg] whitespace-nowrap bg-zinc-800 px-4 py-2 text-center text-6xl font-bold text-[white] opacity-90 transition-opacity duration-500 group-hover:opacity-20 lg:text-5xl md:text-4xl sm:text-6xl xs:text-5xl">
                  SOLD OUT
                </h5>
              )}
            </div>

            <div className="flex basis-[45%] flex-col gap-3 text-right text-zinc-800 sm:text-left">
              <header className="flex flex-col gap-3">
                <h1 className="break-keep text-3xl font-bold xs:text-2xl">
                  {product.name}
                </h1>
                <nav className="text-base font-semibold">
                  <ol>
                    <li className="inline after:px-1 after:content-['>']">
                      <Link
                        href={`/products/categories/${product.category}/all`}
                      >
                        {
                          (categoryData as CategoryDataType)[product.category]
                            .name
                        }
                      </Link>
                    </li>
                    {/* <span className="text-zinc-500">&gt;</span>{" "} */}
                    <li className="inline">
                      <Link
                        href={`/products/categories/${product.category}/${product.subCategory}`}
                      >
                        {(categoryData as CategoryDataType)[
                          product.category
                        ].subCategories?.find(
                          (cur) => cur.path === product.subCategory
                        )?.name || ""}
                      </Link>
                    </li>
                  </ol>
                </nav>

                <h2 className="text-xl font-semibold">
                  {product.price.toLocaleString("ko-KR")} ₩
                </h2>

                <h3 className="text-sm text-zinc-500">{uploadDate}</h3>
              </header>
              <CartTemp product={product} />
              {isAdmin && (
                <div className="flex flex-col gap-2 rounded-lg border p-2 text-center">
                  <h4 className="basis-full text-center text-lg font-semibold">
                    관리자 메뉴
                  </h4>
                  <p className="text-sm text-zinc-500">
                    제품 ID
                    <br />
                    {product.id}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
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

          <article className="relative flex h-fit w-full flex-col gap-3 border-t pt-12 text-zinc-700">
            <p className="mx-auto w-[50%] break-keep pl-2 text-center text-base font-medium leading-8 lg:w-[70%] md:w-[80%] sm:w-full">
              {lineBreaker(product.description)}
            </p>

            <section className="relative mt-9 flex h-fit min-h-screen w-full flex-col gap-12">
              {product.detailImgs.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img.src}
                  alt={`${product.name} 상세 사진 ${i}`}
                  className="m-auto object-contain"
                />
              ))}
            </section>
          </article>
        </div>
      )}
      <Loading show={deleting} fullScreen={true} />
    </main>
  );
};

export default Product;

// 외부에서 링크를 통한 접근일 경우 제품 데이터를 서버 사이드에서 불러오기
// 앱 내부에서 발생한 접근일 경우(inapp=true) 제품 데이터를 클라이언트 사이드에서 불러오기
export async function getServerSideProps({ query }: any) {
  const { id, inapp } = query;

  if (!id) return { props: { isError: true } };

  if (inapp === "true") return { props: { inApp: true } };

  const docRef = doc(db, "products", id);

  const docSnap = await getDoc(docRef).catch((error) => {
    console.error(error);
  });

  return {
    props: docSnap
      ? (docSnap.data() as ProductType) || { isEmpty: true }
      : { isError: true },
  };
}

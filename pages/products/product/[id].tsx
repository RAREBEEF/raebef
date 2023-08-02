import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
import useProduct from "../../../hooks/useProduct";
import categoryData from "../../../public/json/categoryData.json";
import DateTimeFormatter from "../../../tools/dateTimeFormatter";
import lineBreaker from "../../../tools/lineBreaker";
import { CategoryDataType, ProductType } from "../../../types";

interface serverSideProductType extends ProductType {
  isError?: boolean;
}

const Product = (productData: serverSideProductType) => {
  const { data: userData } = useGetUserData();
  const {
    query: { id },
    reload,
    isFallback,
  } = useRouter();
  const [uploadDate, setUploadDate] = useState<string>("");
  const isAdmin = useIsAdmin(userData);
  const {
    deleteProduct: { mutateAsync: deleteProduct, isLoading: deleting },
  } = useProduct();

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
      productData.isError ||
      Object.keys(productData).length === 0
    ) {
      return;
    }

    const dateTime = new DateTimeFormatter(productData.date);

    setUploadDate(dateTime.formatting("/Y/ / /m/ / /d/"));
  }, [productData]);

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
          text: productData.name
            ? productData.name
            : isFallback
            ? "불러오는 중..."
            : "존재하지 않는 제품입니다.",
        }}
      />

      {isFallback || !productData || productData.isError ? (
        <SkeletonProduct />
      ) : (
        <div className="flex flex-col gap-12 px-12 pb-24 xs:px-5">
          <div className="relative flex justify-evenly gap-5 sm:flex-col">
            <div className="group relative aspect-square max-w-[500px] grow basis-[50%]">
              <Image
                src={productData.thumbnail.src}
                alt={productData.name}
                fill
                sizes="(max-width: 639px) 100vw,
                50vw"
                className="object-contain"
                priority
              />

              {productData.totalStock <= 0 && (
                <h5 className="pointer-events-none absolute top-0 bottom-0 left-0 right-0 z-20 m-auto h-fit w-fit rotate-[-25deg] whitespace-nowrap bg-zinc-800 px-4 py-2 text-center text-6xl font-bold text-[white] opacity-90 transition-opacity duration-500 group-hover:opacity-20 lg:text-5xl md:text-4xl sm:text-6xl xs:text-5xl">
                  SOLD OUT
                </h5>
              )}
            </div>

            <div className="flex basis-[45%] flex-col gap-3 text-right text-zinc-800 sm:text-left">
              <header className="flex flex-col gap-3">
                <h1 className="break-keep text-3xl font-bold xs:text-2xl">
                  {productData.name}
                </h1>
                <nav className="text-base font-semibold">
                  <ol>
                    <li className="inline after:px-1 after:content-['>']">
                      <Link
                        href={`/products/categories/${productData.category}/all`}
                      >
                        {
                          (categoryData as CategoryDataType)[
                            productData.category
                          ].name
                        }
                      </Link>
                    </li>
                    {/* <span className="text-zinc-500">&gt;</span>{" "} */}
                    <li className="inline">
                      <Link
                        href={`/products/categories/${productData.category}/${productData.subCategory}`}
                      >
                        {(categoryData as CategoryDataType)[
                          productData.category
                        ].subCategories?.find(
                          (cur) => cur.path === productData.subCategory
                        )?.name || ""}
                      </Link>
                    </li>
                  </ol>
                </nav>

                <h2 className="text-xl font-semibold">
                  {productData.price.toLocaleString("ko-KR")} ₩
                </h2>

                <h3 className="text-sm text-zinc-500">{uploadDate}</h3>
              </header>
              <CartTemp product={productData} />
              {isAdmin && (
                <div className="flex flex-col gap-2 rounded-lg border p-2 text-center">
                  <h4 className="basis-full text-center text-lg font-semibold">
                    관리자 메뉴
                  </h4>
                  <p className="text-sm text-zinc-500">
                    제품 ID
                    <br />
                    {productData.id}
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
              {lineBreaker(productData.description)}
            </p>

            <section className="relative mt-9 flex h-fit min-h-screen w-full flex-col gap-12">
              {productData.detailImgs.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img.src}
                  alt={`${productData.name} 상세 사진 ${i}`}
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

export async function getStaticProps({ params }: any) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
  };
  const app = initializeApp(firebaseConfig);

  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_CI_TOKEN) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN =
        process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_CI_TOKEN;
    }

    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_SITE_KEY as string
      ),
      isTokenAutoRefreshEnabled: true,
    });
  }

  const { id } = params;

  if (!id) return { props: { isError: true } };

  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef).catch((error) => {
    console.error(error);
  });

  return {
    props: (docSnap?.data() as ProductType) || { isError: true },
  };
}

export async function getStaticPaths() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
  };
  const app = initializeApp(firebaseConfig);

  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_CI_TOKEN) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN =
        process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_CI_TOKEN;
    }

    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_SITE_KEY as string
      ),
      isTokenAutoRefreshEnabled: true,
    });
  }

  const querySnapshot = await getDocs(collection(db, "products"));
  const paths: Array<{ params: { id: string } }> = [];

  querySnapshot.forEach((doc) => {
    paths.push({ params: { id: doc.data().id } });
  });

  return { paths, fallback: true };
}

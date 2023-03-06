import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  url?: string;
  img?: string;
}

const Seo: React.FC<Props> = ({ title, description, url, img }) => {
  return (
    <Head>
      <title>{title ? `RAEBEF │ ${title}` : "RAEBEF"}</title>
      {/* 기본 meta 데이터 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="RAREBEEF" />
      <meta
        name="description"
        content={
          description ||
          "RAEBEF는 학습 및 포트폴리오 목적으로 제작된 가상의 의류 쇼핑몰 웹사이트입니다."
        }
      />
      {/* 오픈그래프 */}
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={url || process.env.NEXT_PUBLIC_ABSOLUTE_URL}
      />
      <meta
        property="og:title"
        content={title ? `RAEBEF │ ${title}` : "RAEBEF"}
      />
      <meta
        property="og:image"
        content={
          img ||
          "https://firebasestorage.googleapis.com/v0/b/raebef.appspot.com/o/logo512.svg?alt=media&token=1198373a-8f71-4438-a7ee-a2a575d1c67d"
        }
      />
      <meta
        property="og:description"
        content={
          description ||
          "RAEBEF는 학습 및 포트폴리오 목적으로 제작된 가상의 의류 쇼핑몰 웹사이트입니다."
        }
      />
      <meta property="og:site_name" content="RAEBEF" />
      <meta property="og:locale" content="ko_KR" />
      {/* 트위터카드 */}
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:title"
        content={title ? `RAEBEF │ ${title}` : "RAEBEF"}
      />
      <meta
        name="twitter:description"
        content={
          description ||
          "RAEBEF는 학습 및 포트폴리오 목적으로 제작된 가상의 의류 쇼핑몰 웹사이트입니다."
        }
      />
      <meta
        name="twitter:image"
        content={
          img ||
          "https://firebasestorage.googleapis.com/v0/b/raebef.appspot.com/o/logo512.svg?alt=media&token=1198373a-8f71-4438-a7ee-a2a575d1c67d"
        }
      />
    </Head>
  );
};

export default Seo;

import { Html, Main, Head, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="ko-KR">
      <Head>
        {/* 파비콘 */}
        <link rel="icon" href="/logos/favicon.ico" />
        {/* 구글 폰트 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        {/* 기본 meta 데이터 */}
        <meta name="author" content="RAREBEEF" />
        <meta
          name="description"
          content="RAEBEF는 학습 및 포트폴리오 목적으로 제작된 가상의 의류 쇼핑몰 웹사이트입니다."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* 오픈그래프 */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_ABSOLUTE_URL}
        />
        <meta property="og:title" content="RAEBEF" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/raebef.appspot.com/o/logo512.svg?alt=media&token=1198373a-8f71-4438-a7ee-a2a575d1c67d"
        />
        <meta
          property="og:description"
          content="RAEBEF는 학습 및 포트폴리오 목적으로 제작된 가상의 의류 쇼핑몰 웹사이트입니다."
        />
        <meta property="og:site_name" content="RAEBEF" />
        <meta property="og:locale" content="ko_KR" />
        {/* 트위터카드 */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`RAEBEF`} />
        <meta
          name="twitter:description"
          content="RAEBEF는 학습 및 포트폴리오 목적으로 제작된 가상의 의류 쇼핑몰 웹사이트입니다."
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/raebef.appspot.com/o/logo512.svg?alt=media&token=1198373a-8f71-4438-a7ee-a2a575d1c67d"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

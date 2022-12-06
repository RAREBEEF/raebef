import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@nextcss/reset";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  console.log(router);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

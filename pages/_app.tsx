import React, { useState } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@nextcss/reset";
import Layout from "../components/Layout";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "react-query";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../fb";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* <PointerLoading /> */}
      </Hydrate>
    </QueryClientProvider>
  );
}

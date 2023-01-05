import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@nextcss/reset";
import Layout from "../components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../fb";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("user");
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

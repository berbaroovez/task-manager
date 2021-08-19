import GlobalStyles from "../util/GlobalStyles";
import { AuthProvider } from "../util/Auth";
import { Layout } from "../components/Layout";
import { Nav } from "../components/Nav";
import Head from "next/head";
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Nav />
      <Layout>
        <GlobalStyles />
        <Head>
          <meta name="theme-color" content="#d43e3e" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

import GlobalStyles from "../util/GlobalStyles";
import { AuthProvider } from "../util/Auth";
import { Layout } from "../components/Layout";
import { Nav } from "../components/Nav";
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Nav />
      <Layout>
        <GlobalStyles />

        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

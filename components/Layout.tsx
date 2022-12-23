import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Loading from "./Loading";
import Nav from "./Nav";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      {children}
      <Nav />
      <Footer />
    </>
  );
};

export default Layout;

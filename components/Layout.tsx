import { PropsWithChildren } from "react";
import Footer from "./Footer";
import Nav from "./Nav";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
};

export default Layout;

import { PropsWithChildren } from "react";
import Footer from "./Footer";
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

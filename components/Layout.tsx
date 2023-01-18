import { PropsWithChildren } from "react";
import LayoutFooter from "./LayoutFooter";
import LayoutNav from "./LayoutNav";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <LayoutNav />
      {children}
      <LayoutFooter />
    </>
  );
};

export default Layout;

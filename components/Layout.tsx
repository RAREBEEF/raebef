import { PropsWithChildren } from "react";
import LayoutFooter from "./LayoutFooter";
import LayoutNav from "./LayoutNav";
import LayoutToolbar from "./LayoutToolbar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <LayoutNav />
      {children}
      <LayoutFooter />
      <LayoutToolbar />
    </>
  );
};

export default Layout;

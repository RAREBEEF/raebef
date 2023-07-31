import { PropsWithChildren } from "react";
import LayoutFooter from "./LayoutFooter";
import LayoutNav from "./LayoutNav";
import LayoutToolbar from "./LayoutToolbar";

const Layout = ({ children }: PropsWithChildren) => {
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

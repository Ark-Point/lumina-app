import Footer from "@/web/components/footer";
import Header from "@/web/components/header";
import { StrictPropsWithChildren } from "@/web/types";

const GlobalLayout = ({ children }: StrictPropsWithChildren) => {
  return (
    <div className="layout">
      <Header />
      <main id={"root-container"}>{children}</main>
      <Footer />
    </div>
  );
};

export default GlobalLayout;

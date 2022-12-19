import PageHeader from "../../../components/PageHeader";
import ProductForm from "../../../components/ProductForm";

const New = () => {
  return (
    <div className="page-container">
      <PageHeader
        parent={{ text: "제품 관리", href: "/admin/product" }}
        title={{ text: "제품 추가", href: "/admin/product/new" }}
      />
      <ProductForm />
    </div>
  );
};

export default New;

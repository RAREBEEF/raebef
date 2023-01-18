import HeaderBasic from "../../../components/HeaderBasic";
import FormProduct from "../../../components/FormProduct";

const New = () => {
  return (
    <div className="page-container">
      <HeaderBasic
        parent={{ text: "제품 관리", href: "/admin/product" }}
        title={{ text: "제품 추가" }}
      />
      <FormProduct />
    </div>
  );
};

export default New;

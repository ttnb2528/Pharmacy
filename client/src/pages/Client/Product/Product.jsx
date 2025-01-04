import Breadcrumbs from "./components/Breadcumbs.jsx";
import ListProduct from "./components/ListProduct.jsx";

const Product = (props) => {
  const { title } = props;

  return (
    <div>
      <Breadcrumbs category={title} />
      <ListProduct />
    </div>
  );
};

export default Product;

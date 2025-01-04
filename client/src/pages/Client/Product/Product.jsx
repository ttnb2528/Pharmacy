import Breadcrumbs from "./components/Breadcumbs.jsx";

const Product = (props) => {
  const { title } = props;

  return (
    <div>
      <Breadcrumbs category={title} />
    </div>
  );
};

export default Product;

import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import ProductTable from './ProductComponent/ProductTable';
import CardBox from 'src/components/shared/CardBox';

const Product = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Product ', to: '/' }]} title="Product" />
      <CardBox>
        <ProductTable />
      </CardBox>
    </>
  );
};

export default Product;

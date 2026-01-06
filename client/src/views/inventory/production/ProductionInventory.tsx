import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import ProductionInventoryTable from './ProductionInventoryTable';

const ProductionInventory = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Production', to: '/' }]} title="Production" />
      <CardBox>
        <ProductionInventoryTable />
      </CardBox>
    </div>
  );
};

export default ProductionInventory;

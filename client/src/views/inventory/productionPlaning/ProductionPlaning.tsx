import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import ProductionPlaningTable from './ProductionPlaningTable';

const ProductionPlaning = () => {
  return (
    <div>
      <BreadcrumbComp
        items={[{ title: 'Production Planing', to: '/' }]}
        title="Production Planing"
      />
      <CardBox>
        <ProductionPlaningTable />
      </CardBox>
    </div>
  );
};

export default ProductionPlaning;

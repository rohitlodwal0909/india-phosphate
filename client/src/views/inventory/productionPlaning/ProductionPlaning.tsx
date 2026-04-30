import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import ProductionPlaningTable from './ProductionPlaningTable';

const ProductionPlaning = () => {
  return (
    <div>
      <BreadcrumbComp
        items={[{ title: 'Production Planning', to: '/' }]}
        title="Production Planning"
      />
      <CardBox>
        <ProductionPlaningTable />
      </CardBox>
    </div>
  );
};

export default ProductionPlaning;

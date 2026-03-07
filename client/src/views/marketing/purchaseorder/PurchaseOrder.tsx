import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import PurchaseOrderTable from './PurchaseOrderTable';

const PurchaseOrder = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Purchase Order', to: '/' }]} title="Purchase Order" />
      <CardBox>
        <PurchaseOrderTable />
      </CardBox>
    </div>
  );
};

export default PurchaseOrder;

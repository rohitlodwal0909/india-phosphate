import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import DispatchInventoryTable from './DispatchInventoryTable';

const DispatchInventory = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Dispatch', to: '/' }]} title="Dispatch" />
      <CardBox>
        <DispatchInventoryTable />
      </CardBox>
    </div>
  );
};

export default DispatchInventory;

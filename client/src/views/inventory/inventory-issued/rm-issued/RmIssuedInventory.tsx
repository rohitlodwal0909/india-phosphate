import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import RmIssuedTable from './RmIssuedTable';

const RmIssuedInventory = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'RM Issued', to: '/' }]} title="RM Issued" />
      <CardBox>
        <RmIssuedTable />
      </CardBox>
    </div>
  );
};

export default RmIssuedInventory;

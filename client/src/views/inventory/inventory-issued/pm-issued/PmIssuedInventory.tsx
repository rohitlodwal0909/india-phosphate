import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import PmIssuedTable from './PmIssuedTable';

const PmIssuedInventory = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'PM Issued', to: '/' }]} title="PM Issued" />
      <CardBox>
        <PmIssuedTable />
      </CardBox>
    </div>
  );
};

export default PmIssuedInventory;

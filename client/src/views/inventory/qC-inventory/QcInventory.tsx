import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import QcInventoryTable from './QcInventoryTable';
import CardBox from 'src/components/shared/CardBox';

const QcInventory = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'QA/QC Inspection', to: '/' }]} title="QA/QC Inspection" />
      <CardBox>
        <QcInventoryTable />
      </CardBox>
    </div>
  );
};

export default QcInventory;

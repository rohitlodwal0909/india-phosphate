import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import WorkOrderTable from './WorkOrderTable';

const WorkOrder = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Work Order', to: '/' }]} title="Work Order" />
      <CardBox>
        <WorkOrderTable />
      </CardBox>
    </div>
  );
};

export default WorkOrder;

import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import PoRequisitionTable from './PoRequisitionComponent/PoRequisitionTable';

const PoRequisition = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Po Requisition', to: '/' }]} title="Po Requisition" />
      <CardBox>
        <PoRequisitionTable />
      </CardBox>
    </>
  );
};

export default PoRequisition;

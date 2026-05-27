import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import DisputeTable from './DisputeTable';

const Dispute = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Dispute', to: '/' }]} title="Dispute" />
      <CardBox>
        <DisputeTable />
      </CardBox>
    </div>
  );
};

export default Dispute;

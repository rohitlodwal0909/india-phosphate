import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import Table from './Table';

const BatchApproved = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Batch Record', to: '/' }]} title="Batch Record" />
      <CardBox>
        <div>
          <div className="pb-6 flex justify-end"></div>
        </div>

        <Table />
      </CardBox>
    </div>
  );
};

export default BatchApproved;

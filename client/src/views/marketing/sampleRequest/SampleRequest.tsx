import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import SampleRequestTable from './SampleRequestTable';

const SampleRequest = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Sample Request', to: '/' }]} title="Sample Request" />
      <CardBox>
        <SampleRequestTable />
      </CardBox>
    </div>
  );
};

export default SampleRequest;

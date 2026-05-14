import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import SampleQcTable from './SampleQcTable';

const SampleQc = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Sample Qc Module', to: '/' }]} title="Sample Qc Module" />
      <CardBox>
        <SampleQcTable />
      </CardBox>
    </div>
  );
};

export default SampleQc;

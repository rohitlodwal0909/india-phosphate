import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import DevelopmentTable from './DevelopmentTable';

const Development = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Development', to: '/' }]} title="Development" />
      <CardBox>
        <DevelopmentTable />
      </CardBox>
    </div>
  );
};

export default Development;

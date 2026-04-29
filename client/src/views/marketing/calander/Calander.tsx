import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import CalanderTable from './CalanderTable';

const Calander = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Teams Calander', to: '/' }]} title="Teams Calander" />
      <CardBox>
        <CalanderTable />
      </CardBox>
    </div>
  );
};

export default Calander;

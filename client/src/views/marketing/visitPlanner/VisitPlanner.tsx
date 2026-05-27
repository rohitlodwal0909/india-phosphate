import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import VisitPlannerTable from './VisitPlannerTable';

const VisitPlanner = () => {
  return (
    <div>
      <BreadcrumbComp
        items={[{ title: 'Customer Visit Planner', to: '/' }]}
        title="Customer Visit Planner"
      />
      <CardBox>
        <VisitPlannerTable />
      </CardBox>
    </div>
  );
};

export default VisitPlanner;

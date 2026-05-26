import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import OpportunityTable from './OpportunityComponent.tsx/OpportunityTable';

const Opportunity = () => {
  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'Potential Opportunity ', to: '/' }]}
        title="Potential Opportunity"
      />
      <CardBox>
        <OpportunityTable />
      </CardBox>
    </>
  );
};

export default Opportunity;

import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import GuardTable from './GuardTable';

const GuardInventory = () => {
  return (
    <div>
      <BreadcrumbComp
        items={[{ title: 'Inbound Gate Entry', to: '/' }]}
        title="Inbound Gate Entry"
      />
      <CardBox>
        <GuardTable />
      </CardBox>
    </div>
  );
};

export default GuardInventory;

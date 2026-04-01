import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import FmIssuedTable from './FmIssuedTable';

const FmIssuedInventory = () => {
  return (
    <div>
      <BreadcrumbComp
        items={[{ title: 'Finish Material Issued', to: '/' }]}
        title="Finish Material Issued"
      />
      <CardBox>
        <FmIssuedTable />
      </CardBox>
    </div>
  );
};

export default FmIssuedInventory;

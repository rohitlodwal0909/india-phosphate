import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import GRNEntryTable from './GRNEntryTable';

const StoreInventory = () => {
  return (
    <div>
      <BreadcrumbComp
        items={[{ title: 'Store Verification', to: '/' }]}
        title="Store Verification"
      />

      <CardBox>
        <GRNEntryTable />
      </CardBox>
    </div>
  );
};

export default StoreInventory;

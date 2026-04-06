import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import StoreTable from './StoreComponent/StoreTable';

const PurchaseStore = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Purchase Store', to: '/' }]} title="Purchase Store" />
      <CardBox>
        <StoreTable />
      </CardBox>
    </>
  );
};

export default PurchaseStore;

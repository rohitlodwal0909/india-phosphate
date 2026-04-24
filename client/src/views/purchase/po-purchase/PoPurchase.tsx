import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import PoPurchaseTable from './PoPurchaseComponent/PoPurchaseTable';

const PoPurchase = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Po Purchase', to: '/' }]} title="Po Purchase" />
      <CardBox>
        <PoPurchaseTable />
      </CardBox>
    </>
  );
};

export default PoPurchase;

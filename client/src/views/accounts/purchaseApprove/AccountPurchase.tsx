import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import AccountPurchaseTable from './AccountPurchaseComponent/AccountPurchaseTable';

const AccountPurchase = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Purchase Account', to: '/' }]} title="Purchase Account" />
      <CardBox>
        <AccountPurchaseTable />
      </CardBox>
    </>
  );
};

export default AccountPurchase;
